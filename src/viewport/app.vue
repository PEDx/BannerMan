<template>
  <root-container
    ref="rootContainer"
    v-model="componentsModelTree"
    :lock-to-container-edges="false"
    :hide-sortable-ghost="true"
    :use-window-as-scroll-container="true"
    :should-cancel-start="() => {}"
    :distance="10"
    axis="y"
    lock-axis="y"
    @sort-start="_handleSortStart"
    @sort-end="_handleSortEnd"
    @input="_handleSortInput"
  >
    <components-wrap :components="componentsModelTree"></components-wrap>
  </root-container>
</template>

<script>
import {
  debounce,
  throttle,
  parseQueryString,
  getInstanceProfile,
  serialization,
  getRandomStr,
  UNDEFINED,
  traversal
} from "../utils/index";
import storage from "../storage";
import { getInstanceOrVnodeRect } from "./selector/highlighter";
import ComponentSelector from "./selector/component-selector";
import { ElementMixin } from "./sortble";
import rootContainer from "./components/root-container";

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
    rootContainer
  },
  data() {
    this.widgetTree = [];
    this.componentInstanceMap = {}; // id 对应实例
    this.componentModelMap = {}; // id 对应数据模型
    this.loadingCompleteStatusMap = {};
    this.pageId = null;
    this.dropEndComponentName = "";
    this.selectedId = "";
    this.treeScrolling = false;
    this.resourceDraging = false;
    return {
      componentsModelTree: [], // 组件数据模型, 在此分发传入各个组件的 props
      draging: false
    };
  },
  mounted() {
    this.pageId = parseQueryString(location.href).id;
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;

    selector.startSelecting();

    EventBus.$on("element-selected", instance => {
      this._selectComponentAndHighlightById(instance.$el.id);
    });
    EventBus.$on("element-mouseover", instance =>
      window.parent.postMessage({
        type: "element-mouseover",
        id: instance.$el.id
      })
    );
    this.scrollEnd = debounce(() => {
      this.treeScrolling = false;
    }, 500);
    this._initDocumentListener();
    this._observerGeometric();
    this._renderPageFromLocal(); // 加载保存的组件数据
  },
  provide() {
    return {
      rootContainer: this
    };
  },
  methods: {
    getRandomStr,
    _initDocumentListener() {
      document.addEventListener("mouseleave", () => {
        selector.clearHoverHighlight();
      });
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
        this.$refs.rootContainer.hackState(e);
        this.dropEndComponentName = "";
      });
      document.addEventListener("dragover", e => {
        if (this.dragingType === "drag_resource") return;
        this.$refs.rootContainer.palceholderMove(e);
        e.preventDefault();
      });
      document.addEventListener("drop", e => {
        const msg = e.dataTransfer.getData("WIDGET_TYPE");
        console.log("drop");
        if (msg) {
          this.dropEndComponentName = "widget-container";
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
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      selector.startSelecting();
      if (this.draging) return;
      // 添加元素并排序
      this.newIndex = newIndex;
      if (isPlaceholder) {
        // console.log(newIndex, oldIndex);
        if (!this.dropEndComponentName) return;
        this._asyncAddComponent(this.dropEndComponentName, newIndex);
        return;
      } // 在指定位置添加新组件
      // 正常排序
      if (newIndex === oldIndex && !isPlaceholder) return; // 没有移动过
    },
    _handleSortInput() {
      this.$nextTick(() => {
        const id = this.componentsModelTree[this.newIndex].id;
        this._drawWidgetsTree();
        this._selectComponentAndHighlightById(id);
        sort_status.sorting = false;
      });
    },
    // 需要在生成组件树后再选中高亮
    _selectComponentAndHighlightById(id) {
      if (!id) return;
      this.selectedId = id;
      const instance = this.componentInstanceMap[id];
      const profile = getInstanceProfile(instance) || {};
      selector.highlighitSelectedInstance(instance);
      window.parent.postMessage({
        type: "select-component",
        profile,
        id,
        name: profile.name
      });
    },
    // 监听元素几何属性变化
    _loadImage(e) {
      const img = e.target;
      console.log("imgLoad");
      e.target.draggable = false;
      img.removeEventListener("load", this._loadImage, false);
      selector.resetHighlight();
    },
    _observerGeometric() {
      const MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      // IE 11 及以上兼容
      const mutationObserver = new MutationObserver((mutations, observer) => {
        // 重置高亮
        mutations.forEach(mutation => {
          switch (mutation.type) {
            case "attributes":
              if (mutation.target.tagName === "IMG") {
                mutation.target.addEventListener(
                  "load",
                  this._loadImage,
                  false
                );
              }
              break;
            default:
          }
        });
        if (!sort_status.sorting) {
          console.log("MutationObserver");
          selector.resetHighlight();
        }
      });
      mutationObserver.observe(this.$refs.rootContainer.$el, {
        characterData: true,
        childList: true,
        attributes: true,
        subtree: true
      });
    },
    // 查找实例的 ID
    _findComponentId(ins) {
      const map = this.componentInstanceMap;
      let ret = null;
      Object.keys(this.componentInstanceMap).forEach(key => {
        if (map[key] === ins) ret = key;
      });
      return ret;
    },
    // 使用 ID 查找对应数据模型对象
    _findComponentModelById(id) {
      let ret = null;
      ret = this.componentModelMap[id];
      return ret;
    },
    _childEmitEven(obj, id) {
      // 监听组件更新自己 props 事件
      const props = this.componentInstanceMap[id].props;
      Object.keys(obj).forEach(key => (props[key] = obj[key]));
      window.parent.postMessage({
        type: "flush-controller-value"
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
    _asyncAddComponent(widgetName, place) {
      this._asyncLoadComponent(widgetName).then(ins => {
        const profile = ins.default.extendOptions._profile_;
        const _obj = {};
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });
        // console.log(place);
        this._addComponent({ name: widgetName, propsObj: _obj }, place);
        this.$nextTick(() => {
          const id = this.componentsModelTree[place].id;
          this._drawWidgetsTree();
          this._selectComponentAndHighlightById(id);
        });
      });
    },
    _addComponent({ name, propsObj, id }, place) {
      const _id = id || `${getRandomStr(6)}-${name}`;
      const _len = this.componentsModelTree.length;
      const _obj = {
        name: name,
        props: propsObj,
        children: [
          {
            children: [],
            id: "b23SVc-widget-search",
            name: "widget-search",
            props: {
              width: undefined,
              height: undefined,
              image: undefined,
              color: undefined
            }
          }
        ],
        id: _id
      };
      this.componentsModelTree.splice(place || _len, 0, _obj);
      this.$nextTick(this._setImageNodeUndraggable);
    },
    _setImageNodeUndraggable() {
      [...document.getElementsByTagName("img")].forEach(val => {
        val.draggable = false;
      });
    },
    _asyncLoadComponent(name) {
      const widget = widgets[name];
      return new Promise((resolve, reject) => {
        widget().then(ins => {
          // 防止并发加载多次添加 mixin 到同一组件上
          if (!this.loadingCompleteStatusMap[name]) {
            ins.default.mixin(ElementMixin);
            this.loadingCompleteStatusMap[name] = true;
          }
          resolve(ins);
        });
      });
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      const componentsModelTree =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
      // debugger;
      const _promiseArr = [];
      const _promiseMap = {};
      traversal(componentsModelTree, node => {
        Object.keys(node.props).forEach(key => {
          const _val = node.props[key];
          node.props[key] = _val === UNDEFINED ? undefined : _val;
        });
        if (_promiseMap[node.name]) return;
        const promise = this._asyncLoadComponent(node.name);
        _promiseMap[node.name] = true;
        _promiseArr.push(promise);
      });
      serialization(_promiseArr).then(res => {
        this.componentsModelTree = componentsModelTree;
        this.$nextTick(() => {
          this._setImageNodeUndraggable();
          this._drawWidgetsTree();
        });
      });
    },
    _generateWidgetsTree() {
      // 根据数据模型生成树
      // 生成真实树, 有正确的顺序,且只能是定义有 profile 的组件
      // $children 不保证顺序 https://github.com/vuejs/vue/issues/2275
      const _root = {
        children: []
      };
      const walk = function(parent, componentModel) {
        const _id = componentModel.id;
        const element = document.getElementById(_id);
        const instance = element.__vue__;
        const rect = getInstanceOrVnodeRect(instance);
        const top = rect ? rect.top : Infinity;
        const _obj = {
          children: [],
          top,
          name: getInstanceProfile(instance).name,
          id: _id
        };
        parent.children.push(_obj);
        componentModel.children &&
          componentModel.children.forEach(val => {
            walk(_obj, val);
          });

        this.componentInstanceMap[_id] = instance;
        this.componentModelMap[_id] = componentModel;
      }.bind(this);
      // debugger;
      this.componentsModelTree.forEach(val => {
        walk(_root, val);
      });
      return _root;
    },
    _drawWidgetsTree() {
      console.log("drawWidgetsTree");
      const _tree = this._generateWidgetsTree();
      window.parent.postMessage({
        type: "flush-component-tree",
        instancesTree: _tree.children
      });
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
    deleteComponent() {
      // const compObj = this._findComponentModelById(this.selectedId);
    },
    resetComponentPropData() {
      const compObj = this._findComponentModelById(this.selectedId);
      Object.keys(compObj.props).forEach(key => (compObj.props[key] = void 0));
    },
    updateWidgetProp(data) {
      data = JSON.parse(data);
      const compObj = this._findComponentModelById(this.selectedId);
      compObj.props[data.key] = data.value;
    },
    getWidgetDataValue(key) {
      const vm = this.componentInstanceMap[this.selectedId];
      return vm[key];
    },
    // 清空编辑页面
    clearPage() {
      this.componentsModelTree = [];
      selector.clearHighlight();
    },
    // 保存编辑页面数据对象模型
    savePage() {
      storage.set(
        `${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`,
        this.componentsModelTree
      );
    },
    // 自动保存
    autoSave() {
      setInterval(this.savePage, AUTO_SAVE_TIME);
    },
    onDragend(e) {
      if (this.draging) this.$refs.rootContainer.clearHackState(e);
      this.draging = false;
      this.treeScrolling = false;
    },
    highlighitInstance(id) {
      const instance = this.componentInstanceMap[id];
      selector.highlighitMouseoverInstance(instance);
    },
    highlighitSelectedInstance(id) {
      selector.clearHighlight();
      this._selectComponentAndHighlightById(id);
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

