<template>
  <sortble-container
    class="viewport-content"
    ref="viewportContent"
    v-model="componentStack"
    :lock-to-container-edges="true"
    :distance="10"
    axis="y"
    @sort-start="_handleSortStart"
    @sort-end="_handleSortEnd"
  >
    <component
      v-for="(val, idx) in componentStack"
      :is="val.name"
      :key="`${getRandomStr(6)}-${val.name}`"
      :index="idx"
      @change-prop="val.childEmitEven"
      v-bind="val.props"
    ></component>
  </sortble-container>
</template>

<script>
import {
  debounce,
  throttle,
  generateInstanceBriefObj,
  parseQueryString,
  getInstanceProfile,
  serialization,
  getRandomStr
} from "../utils/index";
import storage from "..//storage";
import ComponentSelector from "./component-selector";
import { ElementMixin } from "vue-slicksort";
import SortbleContainer from "./sortble-container";
import widgets from "../widgets";
import EventBus from "../bus";
const selector = new ComponentSelector();
const LOCAL_SAVE_KEY_PREFIX = "current_viewport_data";
const AUTO_SAVE_TIME = 5 * 60 * 1000;

const sort_status = {
  sorting: false,
  moving: false
};

export default {
  components: {
    "sortble-container": SortbleContainer
  },
  data() {
    this.children = [];
    return {
      componentStack: [], // 组件数据模型, 在此分发传入各个组件的 props
      instancesMap: {},
      loadingCompleteStatusMap: {},
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
    // document.addEventListener("mouseleave", () => {
    //   selector.clearHoverHighlight();
    // });
    // document.addEventListener("mouseenter", () => {
    //   selector.startSelecting();
    // });
    document.addEventListener("dragenter", e => e.preventDefault());
    document.addEventListener("dragover", e => e.preventDefault());
    document.addEventListener("dragleave", e => e.preventDefault());
    document.addEventListener(
      "scroll",
      throttle(e => {
        const scroll_top = document.documentElement.scrollTop;
        const scroll_height = document.documentElement.scrollHeight;
        const window_height = document.documentElement.clientHeight;
        const percent = scroll_top / (scroll_height - window_height);
        window.parent.postMessage({
          type: "viewport-scroll-percent",
          percent: percent.toFixed(2)
        });
      }, 20)
    );
    document.addEventListener("drop", e => {
      const msg = e.dataTransfer.getData("WIDGET_TYPE");
      if (msg) {
        this._asyncAddComponent("widget-search");
        // this._asyncAddComponent("widget-button");
        window.parent.postMessage({
          type: "drag-end",
          axis: {
            x: e.x,
            y: e.y
          }
        });
      }
    });
    EventBus.$on("element-selected", instance => {
      this._selectComponentAndHighlightByIdx(this._findComponentIdx(instance));
    });
    EventBus.$on("element-mouseover", instance =>
      window.parent.postMessage({
        type: "element-mouseover",
        id: instance._EDITER_TREE_UID__
      })
    );

    this._observerGeometric();
    this._renderPageFromLocal(); // 加载保存的组件数据
  },
  methods: {
    getRandomStr,
    _handleSortStart({ index }) {
      selector.stopSelecting();
      sort_status.sorting = true;
    },
    _getInstanceList() {
      return this.$refs.viewportContent.$children || [];
    },
    // 排序完成后所有的排序元素实例都会销毁重建
    _handleSortEnd({ newIndex, oldIndex }) {
      selector.startSelecting();
      sort_status.sorting = false;
      setTimeout(() => {
        if (newIndex === oldIndex) return; // 没有移动过
        this._genComponentsTree();
        this._selectComponentAndHighlightByIdx(newIndex);
      });
    },
    _getRealDomInstanceTree(el) {
      const ret = [];
      for (let i = 0, len = el.children.length; i < len; i++) {
        const _el = el.children[i];
        ret.push(_el.__vue__);
      }
      return ret;
    },
    _selectComponentAndHighlightByIdx(idx) {
      this.index = idx;
      const component = this.componentStack[idx];
      const instance = this._getInstanceList()[idx];
      selector.highlighitSelectedInstance(instance);
      window.parent.postMessage({
        type: "select-component",
        profile: getInstanceProfile(instance),
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
        if (!sort_status.sorting) {
          console.log("viewport attr changed");
          selector.resetHighlight();
        }
      });
      mutationObserver.observe(this.$el, {
        subtree: true,
        attributes: true
      });
    },
    _findComponentIdx(ins) {
      let ret = 0;
      this._getInstanceList().forEach((val, idx) => {
        if (val === ins) ret = idx;
      });
      return ret;
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
    _test_() {
      const promiseArr = [
        "widget-search",
        "widget-search",
        "widget-search",
        "widget-button",
        "widget-search",
        "widget-search",
        "widget-search"
      ].map(this._asyncLoadComponent);
      serialization(promiseArr).then(res => {});
    },
    // 第一次添加组件会是异步加载
    _asyncAddComponent(widgetName) {
      this._asyncLoadComponent(widgetName).then(ins => {
        const profile = ins.default.extendOptions._profile_;
        const _obj = {};
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });
        this._addComponent(widgetName, _obj);
        setTimeout(this._genComponentsTree);
      });
    },
    _asyncFormatComponentFromLocalData(data) {
      return new Promise((resolve, reject) => {
        this._asyncLoadComponent(data.name)
          .then(ins => {
            const profile = ins.default.extendOptions._profile_;
            const _obj = {};
            profile.controllers.forEach(val => {
              _obj[val.propName] = data.props[val.propName];
            });
            resolve([data.name, _obj]);
          })
          .catch(e => reject(e));
      });
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      const componentStack =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
      const _promiseArr = componentStack.map(
        this._asyncFormatComponentFromLocalData
      );
      serialization(_promiseArr).then(res => {
        res.forEach(val => this._addComponent(...val));
        setTimeout(this._genComponentsTree);
      });
    },
    _genComponentsTree() {
      const instances = this._getInstanceList();
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
    },
    updateWidgetProp(key, value) {
      const compObj = this.componentStack[this.index];
      compObj.props[key] = value;
    },
    getWidgetDataValue(key) {
      const vm = this._getInstanceList()[this.index];
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
    highlighitInstance(id) {
      const instance = this.instancesMap[id];
      selector.highlighitMouseoverInstance(instance);
    },
    highlighitSelectedInstance(id) {
      const instance = this.instancesMap[id];
      selector.clearHighlight();
      selector.highlighitSelectedInstance(instance);
      this._selectComponentAndHighlightByIdx(this._findComponentIdx(instance));
    },
    viewportScrollTo(percent) {
      const scroll_height = document.documentElement.scrollHeight;
      const window_height = document.documentElement.clientHeight;
      document.documentElement.scrollTo({
        top: (scroll_height - window_height) * percent
      });
    }
  }
};
</script>

