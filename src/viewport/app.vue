<template>
  <sortble-container
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
  </sortble-container>
</template>

<script>
import {
  debounce,
  throttle,
  parseQueryString,
  getProfileByInstance,
  findRelatedContainerComponent,
  getRandomStr,
  UNDEFINED,
  traversal
} from "../utils/index";
import storage from "../storage";
import { getInstanceOrVnodeRect } from "./selector/highlighter";
import ComponentSelector from "./selector/component-selector";
import { ElementMixin } from "./sortble";
import sortbleContainer from "./components/sortble-container";

import widgets from "../widgets";
import EventBus from "../bus";
const MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver;
const selector = new ComponentSelector();
const LOCAL_SAVE_KEY_PREFIX = "current_viewport_data";
const AUTO_SAVE_TIME = 5 * 60 * 1000;
const SORT_TYPE = {
  SORT: 0, // 正常排序
  ADD: 1 // 添加
};
export default {
  components: {
    sortbleContainer
  },
  data() {
    this.componentInstanceMap = {}; // id 对应实例
    this.componentModelMap = {}; // id 对应数据模型
    this.loadingCompleteStatusMap = {};
    this.pageId = null;
    this.dropEndComponentName = "";
    this.selectedId = "";
    this.treeScrolling = false;
    this.resourceDraging = false;
    this.draging = false;
    this.sorting = false;
    this.sortingType = SORT_TYPE.SORT;
    this.dragingContainer = null;
    return {
      componentsModelTree: [] // 组件数据模型, 在此分发传入各个组件的 props
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
      window.parent.postMessage(
        {
          type: "element-mouseover",
          id: instance.$el.id
        },
        "*"
      )
    );
    this.scrollEnd = debounce(() => {
      this.treeScrolling = false;
    }, 500);
    this._initDocumentListener();
    this._observerGeometric();
    this._observerStyle();
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
        if (this.dragingType === "drag_resource") return;
        // 找到需要添加元素的容器
        const container =
          findRelatedContainerComponent(e.target) || this.$refs.rootContainer;
        if (this.dragingContainer === container) return;
        if (this.dragingContainer && this.dragingContainer.clearHackState) {
          this.dragingContainer.clearHackState(e);
        }
        this.draging = true;
        this.dragingContainer = container;
        this.dragingContainerId = container.$el.id;
        container.hackState(e);
        this.dropEndComponentName = "";
        e.preventDefault();
      });
      document.addEventListener("dragover", e => {
        if (this.dragingType === "drag_resource") return;
        this.dragingContainer.palceholderMove(e);
        e.preventDefault();
      });
      document.addEventListener("drop", e => {
        const widgetName = e.dataTransfer.getData("WIDGET_NAME");
        console.log("drop");
        if (!widgetName) return;
        // debugger
        this.dropEndComponentName = widgetName;
        window.parent.postMessage(
          {
            type: "drag-end",
            axis: {
              x: e.x,
              y: e.y
            }
          },
          "*"
        );
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
          window.parent.postMessage(
            {
              type: "viewport-scroll-percent",
              percent: percent.toFixed(2)
            },
            "*"
          );
        }, 20)
      );
    },
    _handleSortStart({ index }) {
      selector.stopSelecting();
      this.sorting = true;
    },
    // 排序完成后所有的排序元素实例都会销毁重建
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      selector.startSelecting();
      if (this.draging) return;
      this.newIndex = newIndex;
      if (isPlaceholder) {
        if (!this.dropEndComponentName) return;
        this.sortingType = SORT_TYPE.ADD;
        this._asyncAddComponent(this.dropEndComponentName, newIndex);
        return;
      } // 在指定位置添加新组件
      this.sortingType = SORT_TYPE.SORT;
      // 正常排序
      if (newIndex === oldIndex && !isPlaceholder) return; // 没有移动过
    },
    _handleSortInput() {
      // 此时数据模型排序完毕
      this.sorting = false;
      if (this.draging) return;
      if (this.sortingType === SORT_TYPE.ADD) return;
      this.$nextTick(() => {
        const id = this.componentsModelTree[this.newIndex].id;
        this._drawWidgetsTree();
        this._selectComponentAndHighlightById(id);
      });
    },
    // 需要在生成组件树后再选中高亮
    _selectComponentAndHighlightById(id) {
      if (!id) return;
      this.selectedId = id;
      const instance = this.componentInstanceMap[id];
      selector.highlighitSelectedInstance(instance);
      window.parent.postMessage(
        {
          type: "select-component"
        },
        "*"
      );
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
        if (mutations[0].attributeName !== "style") return;
        // 非样式更改不重置 selecter
        if (!this.sorting) {
          console.log("mutations");
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
    _observerStyle() {
      let list = [];
      // 一次性添加完
      const addStyle = debounce(function() {
        console.time('addStyleToTopWindow')
        const docFragWrap = document.createDocumentFragment();
        list.forEach(val => {
          docFragWrap.appendChild(val.cloneNode(true));
        });
        window.parent.document.head.appendChild(docFragWrap);
        console.timeEnd('addStyleToTopWindow')
        list = [];
      }, 30);
      // 为实现自定义控制器, 传递 iframe 样式给顶层 window
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(val => {
          if (val.target.tagName === "STYLE") {
            list.push(val.target);
            addStyle();
          }
        });
      });
      mutationObserver.observe(document.head, {
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
    _componentPropsChanged(obj, id) {
      // 监听组件更新自己 props 事件
      const props = this._findComponentModelById[id].props;
      Object.keys(obj).forEach(key => (props[key] = obj[key]));
      window.parent.postMessage(
        {
          type: "flush-controller-value"
        },
        "*"
      );
    },
    _componentChildrenChanged(sortedArr, id) {
      this.sorting = false;
      if (this.draging) return;
      // 监听组件更新自己 child 事件
      this._findComponentModelById(id).children = sortedArr;
      if (this.sortingType === SORT_TYPE.ADD) return;
      this.$nextTick(() => {
        const _id = this._findComponentModelById(id).children[this.newIndex].id;
        this._drawWidgetsTree();
        this._selectComponentAndHighlightById(_id);
      });
    },
    _contianerSortStart() {
      selector.stopSelecting();
      this.sorting = true;
    },
    _contianerSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      selector.startSelecting();
      this.newIndex = newIndex;
      if (isPlaceholder) {
        if (!this.dropEndComponentName) return;
        this.sortingType = SORT_TYPE.ADD;
        this._asyncAddComponent(this.dropEndComponentName, newIndex);
        return;
      } // 在指定位置添加新组件
      this.sortingType = SORT_TYPE.SORT;
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
      return promiseArr;
    },
    // 第一次添加组件会是异步加载
    _asyncAddComponent(widgetName, place) {
      this._asyncLoadComponent(widgetName).then(ins => {
        const profile = ins.default.extendOptions._profile_;
        const _obj = {};
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });
        this._addComponent({ name: widgetName, propsObj: _obj }, place);
      });
    },
    _addComponent({ name, propsObj, id }, place) {
      const _id = id || `${getRandomStr(6)}-${name}`;
      const _containerModel = this._findComponentModelById(
        this.dragingContainerId
      ) || { children: this.componentsModelTree };
      const _obj = {
        name: name,
        props: propsObj,
        children: [],
        id: _id
      };
      _containerModel.children.splice(place, 0, _obj);
      this.$nextTick(() => {
        const id = _containerModel.children[place].id;
        this._drawWidgetsTree();
        this._setImageNodeUndraggable();
        this._selectComponentAndHighlightById(id);
      });
      // return _containerModel;
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
      Promise.all(_promiseArr).then(res => {
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
        if (!element) return;
        const instance = element.__vue__;
        const rect = getInstanceOrVnodeRect(instance);
        const top = rect ? rect.top : Infinity;
        const _obj = {
          children: [],
          top,
          name: getProfileByInstance(instance).name,
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
      console.time("drawWidgetsTree");
      const _tree = this._generateWidgetsTree();
      console.timeEnd("drawWidgetsTree");
      window.parent.postMessage(
        {
          type: "flush-component-tree",
          instancesTree: _tree.children
        },
        "*"
      );
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
    deleteComponentFromModel() {
      // const compObj = this._findComponentModelById(this.selectedId);
      let index = NaN;
      traversal([{ children: this.componentsModelTree }], node => {
        const list = node.children || [];
        list.forEach((val, idx) => {
          if (val.id === this.selectedId) {
            index = idx;
          }
        });
        if (index >= 0) {
          list.splice(index, 1);
          return;
        }
      });
      if (index >= 0) {
        console.log("deleted");
        this.$nextTick(this._drawWidgetsTree);
        selector.clearHighlight();
      }
    },
    resetComponentPropData() {
      const compObj = this._findComponentModelById(this.selectedId);
      Object.keys(compObj.props).forEach(key => (compObj.props[key] = void 0));
    },
    updateWidgetProp(data) {
      // 注意: 此时更新 props 必须是组件声明过的 props 才能得到更新,
      // 动态添加的 props 无法更新
      // 譬如读取历史生成的组件, 开发过程中再更改组件的 props 会出现此 bug
      const compObj = this._findComponentModelById(this.selectedId);
      compObj.props[data.key] = data.value;
    },
    getWidgetDataValue(key) {
      const vm = this.componentInstanceMap[this.selectedId];
      return vm[key];
    },
    getSelectWidgetProfile() {
      if (!this.selectedId) return;
      const instance = this.componentInstanceMap[this.selectedId];
      return getProfileByInstance(instance) || {};
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
      this.draging = false;
      this.sorting = false;
      this.treeScrolling = false;
      if (this.dragingContainer && this.dragingContainer.clearHackState) {
        this.dragingContainer.clearHackState(e);
        this.dragingContainer = null;
      }
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
      if (this.sorting) return;
      this.treeScrolling = true;
      const scroll_height = document.documentElement.scrollHeight;
      const window_height = document.documentElement.clientHeight;
      document.documentElement.scrollTo({
        top: (scroll_height - window_height) * percent
      });
      this.scrollEnd();
    },
    setDragType(type) {
      this.dragingType = type;
    }
  }
};
</script>

