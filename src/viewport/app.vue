<template>
  <sortble-container
    class="viewport-content"
    ref="viewportContent"
    v-model="componentStack"
    :lock-to-container-edges="true"
    :hide-sortable-ghost="true"
    :use-window-as-scroll-container="true"
    :should-cancel-start="() => {}"
    :distance="10"
    axis="y"
    lock-axis="y"
    @sort-start="_handleSortStart"
    @sort-end="_handleSortEnd"
  >
    <component
      v-for="(val, idx) in componentStack"
      :is="val.name"
      :key="`${val.id}-${val.name}`"
      :id="val.id"
      :element-mixin-index="idx"
      @change-prop="_childEmitEven(...arguments ,val.id)"
      v-bind="val.props"
    ></component>
    <sortble-item
      :element-mixin-index="componentStack.length"
      v-show="true"
      :element-mixin-is-placeholder="true"
      style="position: absolute; top: 0px;left: 0;width: 100%;"
    >
      <div style="width: 100%;height: 80px; border: 2px dashed #eee;box-sizing: border-box;"></div>
    </sortble-item>
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
import storage from "../storage";
import ComponentSelector from "./selector/component-selector";
import { ElementMixin, SlickList, SlickItem } from "./sortble";
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
    "sortble-container": SlickList,
    "sortble-item": SlickItem
  },
  data() {
    this.children = [];
    this.componentInstanceMap = {}; // id 对应实例
    this.instancesMap = {};
    this.loadingCompleteStatusMap = {};
    this.pageId = null;
    this.treeScrolling = false;
    this.resourceDraging = false;
    return {
      componentStack: [], // 组件数据模型, 在此分发传入各个组件的 props
      draging: false
    };
  },
  mounted() {
    this.pageId = parseQueryString(location.href).id;
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;

    selector.startSelecting();

    EventBus.$on("element-selected", instance => {
      this._selectComponentAndHighlightById(this._findComponentId(instance));
    });
    EventBus.$on("element-mouseover", instance =>
      window.parent.postMessage({
        type: "element-mouseover",
        id: instance._EDITER_TREE_UID__
      })
    );
    this.scrollEnd = debounce(() => {
      this.treeScrolling = false;
    }, 5000);
    this._initDocumentEvent();
    this._observerGeometric();
    this._renderPageFromLocal(); // 加载保存的组件数据
  },
  methods: {
    getRandomStr,
    _initDocumentEvent() {
      // document.addEventListener("mouseleave", () => {
      //   selector.clearHoverHighlight();
      // });
      // document.addEventListener("mouseenter", () => {
      //   selector.startSelecting();
      // });
      window.onresize = debounce(() => {
        console.log("viewport resize");
        selector.resetHighlight();
        this._setMeta(document.body.clientWidth);
      }, 150);
      document.addEventListener("dragenter", e => {
        e.preventDefault();
        if (this.draging) return;
        if (this.dragingType === "drag_resource") return;
        this.draging = true;
        this.$refs.viewportContent.hackState(e);
        console.log("dragenter");
      });
      document.addEventListener(
        "dragover",
        throttle(e => {
          if (this.dragingType === "drag_resource") return;
          this.$refs.viewportContent.palceholderMove(e);
          e.preventDefault();
        }, 20)
      );
      document.addEventListener("drop", e => {
        console.log("drop");
        const msg = e.dataTransfer.getData("WIDGET_TYPE");
        if (msg) {
          this._asyncAddComponent("widget-button");
          window.parent.postMessage({
            type: "drag-end",
            axis: {
              x: e.x,
              y: e.y
            }
          });
        }
      });
      document.addEventListener(
        "scroll",
        throttle(e => {
          if (this.treeScrolling) return;
          // 此处会相互触发 srcoll 事件
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
    },
    _handleSortStart({ index }) {
      selector.stopSelecting();
      sort_status.sorting = true;
    },
    // 排序完成后所有的排序元素实例都会销毁重建
    _handleSortEnd({ newIndex, oldIndex }) {
      selector.startSelecting();
      if (this.draging) return;
      setTimeout(() => {
        if (newIndex === oldIndex) return; // 没有移动过
        const id = this.componentStack[newIndex].id;
        this._genComponentsTree();
        this._selectComponentAndHighlightById(id);
        sort_status.sorting = false;
      });
    },
    _getRealDomInstanceTree(el) {
      const ret = [];
      for (let i = 0, len = el.children.length; i < len; i++) {
        const _el = el.children[i];
        _el.__vue__.$options._profile_ && ret.push(_el.__vue__);
      }
      return ret;
    },
    _selectComponentAndHighlightById(id) {
      if (!id) return;
      this.id = id;
      const instance = this.componentInstanceMap[id];
      const component = this._findComponentObjById(id);
      selector.highlighitSelectedInstance(instance);
      window.parent.postMessage({
        type: "select-component",
        profile: getInstanceProfile(instance) || {},
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
          selector.resetHighlight();
        }
      });
      mutationObserver.observe(this.$refs.viewportContent.$el, {
        subtree: true,
        attributes: true
      });
    },
    _findComponentId(ins) {
      const map = this.componentInstanceMap;
      let ret = null;
      Object.keys(this.componentInstanceMap).forEach(key => {
        if (map[key] === ins) ret = key;
      });
      return ret;
    },
    _findComponentObjById(id) {
      let ret = null;
      this.componentStack.forEach(val => {
        if (val.id === id) ret = val;
      });
      return ret;
    },
    _childEmitEven(obj, id) {
      const props = this.componentInstanceMap[id].props;
      Object.keys(obj).forEach(key => (props[key] = obj[key]));
      window.parent.postMessage({
        type: "flush-controller-value"
      });
    },
    _addComponent(name, propsObj, id) {
      const _id = id || `${getRandomStr(6)}-${name}`;
      this.componentStack.push({
        name: name,
        props: propsObj,
        id: _id
      }); // 在此初始化组件
      this.$nextTick(() => {
        this.componentInstanceMap[_id] = document.getElementById(_id).__vue__;
      });
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
            resolve([data.name, _obj, data.id]);
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
      const instances = this._getRealDomInstanceTree(
        this.$refs.viewportContent.$el
      );
      // debugger;
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
      const compObj = this._findComponentObjById(this.id);
      compObj.props[key] = value;
      setTimeout(() => {
        this._genComponentsTree();
        this._selectComponentAndHighlightById(this.id);
        // 还需要找到 mouseover 的元素
      });
    },
    getWidgetDataValue(key) {
      const vm = this.componentInstanceMap[this.id];
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
    onDragend(e) {
      if (this.draging) this.$refs.viewportContent.clearHackState(e);
      this.draging = false;
      this.treeScrolling = false;
    },
    highlighitInstance(id) {
      const instance = this.instancesMap[id];
      selector.highlighitMouseoverInstance(instance);
    },
    highlighitSelectedInstance(id) {
      const instance = this.instancesMap[id];
      selector.clearHighlight();
      this._selectComponentAndHighlightById(this._findComponentId(instance));
    },
    viewportScrollTo(percent) {
      if (sort_status.sorting) return;
      this.treeScrolling = true;
      const scroll_height = document.documentElement.scrollHeight;
      const window_height = document.documentElement.clientHeight;
      document.documentElement.scrollTo({
        top: (scroll_height - window_height) * percent
      });
      this.scrollEnd();
    },
    setDragType(tyoe) {
      this.dragingType = tyoe;
    }
  }
};
</script>

