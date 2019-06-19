<template>
  <sortble-list
    class="viewport-content"
    ref="viewportContent"
    v-model="componentStack"
    :use-window-as-scrol-container="false"
    :press-threshold="10"
    axis="y"
    lock-axis="y"
    @sort-start="_handleSortStart"
    @sort-move="_handleSortMove"
    @sort-end="_handleSortEnd"
    @input="_handleSortInput"
  >
    <component
      v-for="(val, idx) in componentStack"
      :is="val.name"
      :key="`${idx}-${val.name}`"
      :index="idx"
      @change-prop="val.childEmitEven"
      v-bind="val.props"
    ></component>
  </sortble-list>
</template>

<script>
import {
  debounce,
  generateInstanceBriefObj,
  parseQueryString
} from "../utils/index";
import storage from "../utils/storage";
import ComponentSelector from "./component-selector";
import { ElementMixin } from "vue-slicksort";
import { SortbleList } from "./sortble/index";
import widgets from "../widgets";
import EventBus from "../bus";
const selector = new ComponentSelector();
const LOCAL_SAVE_KEY_PREFIX = "current_viewport_data";
const AUTO_SAVE_TIME = 5 * 60 * 1000;
export default {
  components: {
    "sortble-list": SortbleList
  },
  data() {
    this.children = [];
    return {
      componentStack: [], // 组件数据模型, 在此分发传入各个组件的 props
      instancesMap: {},
      loadingCompleteStatusMap: {},
      sortFlag: false,
      pageId: null,
      index: 0
    };
  },
  mounted() {
    this.pageId = parseQueryString(location.href).id;
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;
    window.onresize = debounce(() => {
      console.log("viewport resize");
      selector.resetHighlight();
      this._setMeta(document.body.clientWidth);
    }, 150);
    selector.startSelecting();
    document.addEventListener("mouseleave", selector.stopSelecting);
    document.addEventListener("dragenter", e => e.preventDefault());
    document.addEventListener("dragover", e => e.preventDefault());
    document.addEventListener("dragleave", e => e.preventDefault());
    document.addEventListener("drop", e => {
      const msg = e.dataTransfer.getData("WIDGET_TYPE");
      if (msg) {
        this._asyncAddComponent("widget-search");
        window.parent.postMessage({
          type: "drag-end",
          axis: {
            x: e.x,
            y: e.y
          }
        });
      }
    });
    EventBus.$on("element-selected", instance =>
      this._selectComponent(instance)
    );
    EventBus.$on("element-mouseover", instance =>
      window.parent.postMessage({
        type: "element-mouseover",
        id: instance._EDITER_TREE_UID__
      })
    );

    this._observerGeometric();
    this._renderPageFromLocal();
  },
  methods: {
    _handleSortStart() {
      selector.stopSelecting();
      this.sortFlag = true;
      console.log("_handleSortStart");
    },
    _handleSortMove() {
      selector.clearHighlight();
      console.log("_handleSortMove");
    },
    _handleSortEnd() {
      selector.startSelecting();
      this.sortFlag = false;
      console.log("_handleSortEnd");
    },
    _handleSortInput() {
      console.log("_handleSortInput");
    },
    _selectComponent(instance) {
      this.index = this._findComponentIdx(instance);
      const component = this.componentStack[this.index];
      window.parent.postMessage({
        type: "select-component",
        profile: instance._profile_,
        id: instance._EDITER_TREE_UID__,
        name: component.name
      });
    },
    // 监听元素几何属性变化
    _observerGeometric() {
      const MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      // IE 11 及以上兼容
      const mutationObserver = new MutationObserver((mutations, observer) => {
        // 重置高亮
        if (!this.sortFlag) {
          console.log("viewport attr changed");
          selector.resetHighlight();
        }
      });
      mutationObserver.observe(this.$refs.viewportContent.$el, {
        subtree: true,
        attributes: true
      });
    },
    _findComponentIdx(ins) {
      let ret = 0;
      this.$refs.viewportContent.$children.forEach((val, idx) => {
        if (val === ins) ret = idx;
      });
      return ret;
    },
    _asyncLoadComponent(name) {
      const widget = widgets[name];
      return new Promise((resolve, reject) => {
        widget().then(ins => {
          if (!this.loadingCompleteStatusMap[name]) {
            // 防止并发加载多次添加 mixin 到同一组件上
            ins.default.mixin(ElementMixin);
            this.loadingCompleteStatusMap[name] = true;
          }
          resolve(ins);
        });
      });
    },
    // 第一次添加组件会是异步加载
    _asyncAddComponent(widgetName) {
      this._asyncLoadComponent(widgetName).then(ins => {
        const profile = ins.default.prototype._profile_;
        const _obj = {};
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });
        this._addComponent(widgetName, _obj);
        setTimeout(this._genCompTree, 0);
      });
    },
    _addComponent(name, propsObj) {
      this.componentStack.push({
        name: name,
        props: propsObj,
        childEmitEven: (prpos => {
          return obj => {
            Object.keys(obj).forEach(key => (prpos[key] = obj[key]));
            window.parent.postMessage({
              type: "flush-controller-value"
            });
          };
        })(propsObj)
      }); // 在此初始化组件
    },
    _asyncFormatComponentFromLocalData(data) {
      return new Promise((resolve, reject) => {
        this._asyncLoadComponent(data.name)
          .then(ins => {
            const profile = ins.default.prototype._profile_;
            const _obj = {};
            profile.controllers.forEach(val => {
              _obj[val.propName] = data.props[val.propName];
            });

            this._addComponent(data.name, _obj);
            setTimeout(resolve, 0);
          })
          .catch(e => reject(e));
      });
    },
    _genCompTree() {
      const instances = this.$refs.viewportContent.$children;
      const instancesTree = generateInstanceBriefObj(instances);
      const map = {};
      function walk(instance) {
        map[instance._EDITER_TREE_UID__] = instance;
        if (instance.children) {
          instance.children.forEach(child => {
            child.parent = instance;
            walk(child);
          });
        }
      }
      instances.forEach(walk);
      this.instancesMap = map;
      window.parent.postMessage({
        type: "flush-component-tree",
        instancesTree
      });
    },
    _deleteComponent(idx) {
      this.componentStack.splice(idx, 1);
    },
    updateWidgetProp(key, value) {
      const compObj = this.componentStack[this.index];
      compObj.props[key] = value;
    },
    getWidgetDataValue(key) {
      const vm = this.$refs.viewportContent.$children[this.index];
      return vm[key];
    },
    // 清空编辑页面
    clearPage() {
      this.componentStack = [];
      selector.clearHighlight();
    },
    // 保存编辑页面数据对象模型
    savePage() {
      storage.set(
        `${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`,
        this.componentStack
      );
    },
    // 自动保存
    autoSave() {
      setInterval(this.savePage, AUTO_SAVE_TIME);
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      const componentStack =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
      const _promiseArr = componentStack.map(
        this._asyncFormatComponentFromLocalData
      );
      Promise.all(_promiseArr).then(() => {
        this._genCompTree(); // 生成组件树
      });
    },
    highilighitInstance(id) {
      const instance = this.instancesMap[id];
      selector.highilighitMouseoverInstance(instance);
    },
    highilighitSelectedInstance(id) {
      const instance = this.instancesMap[id];
      selector.clearHighlight();
      selector.highilighitSelectedInstance(instance);
      this._selectComponent(instance);
    },
    _setMeta(baseWidth) {
      const scale = 1;
      const meta = document.createElement("meta");
      let metaContent = "";
      if (/Android (\d+\.\d+)/.test(navigator.userAgent)) {
        var version = parseFloat(RegExp.$1);
        if (version > 2.3) {
          var phoneScale = (parseInt(window.screen.width) * scale) / baseWidth;
          metaContent = `width=${baseWidth}, minimum-scale =${phoneScale}, maximum-scale=${phoneScale}, target-densitydpi=device-dpi`;
        } else {
          metaContent = `width=${baseWidth}, target-densitydpi=device-dpi`;
        }
      } else {
        metaContent = `width=${baseWidth}, user-scalable=no`;
      }
      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", metaContent);
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }
};
</script>

