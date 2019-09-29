<template>
  <div class="viewport-wrap">
    <div
      id="viewport"
      class="viewport"
      :style="{width: `${viewSize.width || 375}px`,height: `${viewSize.height || 667}px`,transform: `scale(${viewScale})`,transformOrigin: 'top'}"
    >
      <sort-container
        ref="rootContainer"
        :bm-sort-container-data="componentsModelTree"
        @sort-start="_handleSortStart"
        @sort-end="_handleSortEnd"
        @insert-start="_handleInsertStart"
        @insert-end="_handleInsertEnd"
      >
        <components-wrap :components="componentsModelTree"></components-wrap>
      </sort-container>
    </div>
  </div>
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
} from "@utils/index";
import storage from "@/storage";
import { getInstanceOrVnodeRect } from "./selector/highlighter";
import ComponentSelector from "./selector/component-selector";
import SortElementMixin from "./sortble/SortElementMixin";
import SortContainer from "./sortble/SortContainer";
import { WidgetContainerMixin } from "./components/widget-container-mixin";

import widgets from "@/widgets";
import EventBus from "@/bus";
const MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver;
const selector = new ComponentSelector(document.getElementById("viewport"));
const LOCAL_SAVE_KEY_PREFIX = "current_viewport_data";
const AUTO_SAVE_TIME = 5 * 60 * 1000;
const SORT_TYPE = {
  SORT: 0, // 正常排序
  ADD: 1 // 添加
};
const _BM_EDIT_RUNTIME_ = true; // 全局变量, 告诉各个容器控件此时在编辑器内
window._BM_EDIT_RUNTIME_ = _BM_EDIT_RUNTIME_;
window._BM_WIDGET_CONTAINER_MIXIN_ = WidgetContainerMixin; // 由编辑器提供容器的可拖拽功能

export default {
  components: {
    SortContainer
  },
  data() {
    this.componentInstanceMap = {}; // id 对应实例
    this.componentModelMap = {}; // id 对应数据模型
    this.loadingCompleteStatusMap = {};
    this.pageId = null;
    this.dragingContainerId = null;
    this.dropEndComponentName = "";
    this.treeScrolling = false;
    this.resourceDraging = false;
    this.draging = false;
    this.sorting = false;
    this.sortingType = SORT_TYPE.SORT;
    this.dragingContainer = null;
    this.prevDragingContainer = null;
    return {
      viewSize: {},
      viewScale: 1,
      selectedId: "",
      componentsModelTree: [] // 组件数据模型, 在此分发传入各个组件的 props
    };
  },
  mounted() {
    this.pageId = parseQueryString(location.href).id;
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;
    window.parent.postMessage(
      {
        type: "viewportLoaded"
      },
      "*"
    );
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
      // window.onresize = debounce(() => {
      //   console.log("viewport resize");
      //   selector.resetHighlight();
      //   this._setMeta(document.body.clientWidth);
      // }, 150);
      document.addEventListener("drop", e => {
        const widgetName = e.dataTransfer.getData("WIDGET_NAME");
        if (!widgetName) return;
        this.dropEndComponentName = widgetName;
        e.preventDefault();
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
    _handleInsertStart(e) {
      selector.stopSelecting();
      this.sorting = true;
      if (this.dragingType === "drag_resource") return;
      // // 找到需要添加元素的容器
      const container =
        findRelatedContainerComponent(e.target) || this.$refs.rootContainer;
      if (this.dragingContainer === container) return;
      this.draging = true;
      if (this.prevDragingContainer) {
        if (!this.prevDragingContainer.triggerDragEnd) debugger;
        this.prevDragingContainer.triggerDragEnd();
      }
      this.dragingContainer = container;
      this.prevDragingContainer = container;
      // console.log(container);
      selector.clearContainerHighlight();
      selector.highlighitContainerInstance(container);
      this.dragingContainerId = container.$el.id;
      this.dropEndComponentName = "";
    },
    _handleInsertEnd(index) {
      selector.startSelecting();
      this.sortingType = SORT_TYPE.ADD;
      if (this.dropEndComponentName) {
        this._asyncAddComponent(this.dropEndComponentName, index);
      }
    },
    _handleSortStart(e) {
      this.sorting = true;
      this.selectedId = "";
      selector.stopSelecting();
    },
    // 排序完成后所有的排序元素实例都会销毁重建
    _handleSortEnd(info) {
      if (this.draging) return;
      selector.startSelecting();
      setTimeout(() => {
        const id = info.id;
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
          type: "select-component",
          id
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
        if (this.sorting) return;
        // 重置高亮
        let haveStyleLoad = false;
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
              if (mutation.attributeName === "style") {
                haveStyleLoad = true;
              }

              break;
            default:
          }
        });
        if (!haveStyleLoad) return;
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
        console.time("addStyleToTopWindow");
        const docFragWrap = document.createDocumentFragment();
        list.forEach(val => {
          docFragWrap.appendChild(val.cloneNode(true));
        });
        window.parent.document.head.appendChild(docFragWrap);
        console.timeEnd("addStyleToTopWindow");
        list = [];
      }, 30);
      // 为实现自定义控制器, 传递 iframe 样式给顶层 window
      const mutationObserver = new MutationObserver(mutations => {
        mutations.forEach(val => {
          const tag = val.target.tagName;
          const releaseTag = val.addedNodes[0].tagName;
          if (tag === "STYLE") {
            list.push(val.target);
            addStyle();
          }
          if (releaseTag === "LINK") {
            list.push(val.addedNodes[0]);
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
    // tab 容器专用 api
    _tabsCountChanged(count, id) {
      this._generateComponentModelMap();
      this.dragingContainerId = id;
      const containersArr = this._findComponentModelById(id).children;
      // debugger
      if (containersArr.length > count) {
        // decrese tab container
        containersArr.pop();
        this.$nextTick(this._drawWidgetsTree);
      } else if (containersArr.length < count) {
        // increase
        this._asyncAddComponent("widget-container", containersArr.length);
      }
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
        multContainer: name === "widget-tabs",
        id: _id
      };
      _containerModel.children.splice(place, 0, _obj);
      this.componentModelMap[_id] = _obj;
      this.$nextTick(() => {
        const id = _containerModel.children[place].id;
        this._drawWidgetsTree();
        this._setImageNodeUndraggable();
        this._selectComponentAndHighlightById(id);
      });
      this.dragingContainerId = null;
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
          if (!this.loadingCompleteStatusMap[name] && !!_BM_EDIT_RUNTIME_) {
            ins.default.mixin(SortElementMixin);
            this.loadingCompleteStatusMap[name] = true;
          }
          resolve(ins);
        });
      });
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      console.time("renderPageFromLocal");
      const componentsModelTree =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
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
          console.timeEnd("renderPageFromLocal");
          this._setImageNodeUndraggable();
          this._drawWidgetsTree();
        });
      });
    },
    _generateComponentModelMap() {
      traversal(this.componentsModelTree, node => {
        this.componentModelMap[node.id] = node;
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
        if (Array.isArray(componentModel)) {
          componentModel.forEach(val => {
            walk(parent, val);
          });
          return;
        }
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
      }.bind(this);
      // debugger;
      this.componentsModelTree.forEach(val => {
        walk(_root, val);
      });
      return _root;
    },
    _drawWidgetsTree() {
      console.time("drawWidgetsTree");
      this._generateComponentModelMap();
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
      let index = -1;
      let list = null;
      traversal([{ children: this.componentsModelTree }], node => {
        const _list = node.children || [];
        _list.forEach((val, idx) => {
          if (val.id === this.selectedId) {
            index = idx;
            list = _list;
          }
        });
      });
      if (index >= 0) {
        if (list[index]) delete this.componentModelMap[list[index].id];
        list.splice(index, 1);
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
      if (!compObj) return;
      compObj.props[data.key] = data.value;
      selector.resetHighlight();
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
    // 改变页面分辨率
    changeViewSize(size) {
      this.viewSize = size;
    },
    // 改变页面缩放比
    changeViewScale(scale) {
      this.viewScale = (scale / 100).toFixed(2);
    },
    onDragend(e) {
      this.draging = false;
      this.sorting = false;
      this.treeScrolling = false;
      if (this.dragingContainer) {
        this.dragingContainer.handleDropEnd(e);
        this.dragingContainer = null;
        this.prevDragingContainer = null;
        selector.clearContainerHighlight();
      }
    },
    onDrag(e) {},
    highlighitInstance(id) {
      const instance = this.componentInstanceMap[id];
      selector.highlighitMouseoverInstance(instance);
    },
    highlighitSelectedInstance(id) {
      // debugger;
      this.selectedId = id;
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
<style>
html,
body {
  height: 100%;
}
</style>
<style lang="scss" scoped>
.viewport-wrap {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-top: 60px;
  overflow: hidden;
}
.viewport {
  position: relative;
  margin: 0 auto;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.42), 0 0 24px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  transition: all 0.3s ease;
}
</style>

