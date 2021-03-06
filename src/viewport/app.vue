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
        @drag-start="_handleDragStart"
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
import { reqUpdatePage, reqBuildPage, reqGetPageById } from "@/api/page";
import { getInstanceOrVnodeRect } from "./selector/highlighter";
import ComponentSelector from "./selector/component-selector";
import SortElementMixin from "./sortble/SortElementMixin";
import SortContainer from "./sortble/SortContainer";
// import clonedeep from "lodash.clonedeep";
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
let widget_count = 0;
export default {
  components: {
    SortContainer
  },
  data() {
    this.emitEventMap = {};
    this.onEventList = [];
    this.widgetWersionMap = {};
    this.componentModelMap = {}; // id 对应数据模型
    this.componentProfileMap = {}; //  组件名对应 Profile
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
      componentInstanceMap: {}, // id 对应实例
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
    this.updateWidgetProp = throttle(this._updateWidgetProp, 100);
    this._initDocumentListener();
    this._observerGeometric();
    this._observerStyle();
    this._renderPageFromLocal();
  },
  provide() {
    return {
      rootContainer: this
    };
  },

  methods: {
    getRandomStr,
    _initDocumentListener() {
      const rootContainerEl = this.$refs.rootContainer.$el;
      document.addEventListener("mouseleave", () => {
        selector.clearHoverHighlight();
      });
      document.addEventListener("drop", e => {
        const widgetName = e.dataTransfer.getData("WIDGET_NAME");
        if (!widgetName) return;
        this.dropEndComponentName = widgetName;
        e.preventDefault();
      });
      rootContainerEl.addEventListener(
        "scroll",
        throttle(e => {
          if (this.treeScrolling) return;
          // 此处会相互触发 srcoll 事件
          const scroll_top = rootContainerEl.scrollTop;
          const scroll_height = rootContainerEl.scrollHeight;
          const window_height = rootContainerEl.clientHeight;
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
    _handleWidgetEvent(event, id) {
      // console.log(event);
      const emitEventName = `${id}|${event.type}`;
      this.onEventList.forEach(val => {
        const ins = val.ins;
        if (ins[val.propName].join("|") === emitEventName) {
          ins[val.handleName] && ins[val.handleName]();
        }
      });
    },
    _handleDragStart(ins) {
      ins.cancelDrag = this.dragingType === "drag_resource";
    },
    _handleInsertStart(e) {
      selector.stopSelecting();
      this.sorting = true;
      this.selectedId = "";
      // // 找到需要添加元素的容器
      const container =
        findRelatedContainerComponent(e.target) || this.$refs.rootContainer;
      if (this.dragingContainer === container) return;
      this.draging = true;
      if (this.prevDragingContainer) {
        if (!this.prevDragingContainer.triggerDragEnd) return;
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
    // 第一次添加组件会是异步加载
    _asyncAddComponent(widgetName, place) {
      this._loadWidgetScript(widgetName).then(ins => {
        const profile = ins.extendOptions._profile_;
        const _obj = {};
        const _id = `${getRandomStr(6)}-${widget_count++}-${widgetName}`;
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });
        this._addComponent(
          { name: widgetName, propsObj: _obj, id: _id },
          place
        );
      });
    },
    _addComponent({ name, propsObj, id }, place) {
      const _containerModel = this._findComponentModelById(
        this.dragingContainerId
      ) || { children: this.componentsModelTree };
      const _obj = {
        name: name,
        props: propsObj,
        children: [],
        id: id
      };
      _containerModel.children.splice(place, 0, _obj);
      this.componentModelMap[id] = _obj;
      this.$nextTick(() => {
        const id = _containerModel.children[place].id;
        this._drawWidgetsTree();
        this._setImageNodeUndraggable();
        if (_containerModel.name !== "widget-tabs") {
          // fix: 特殊处理, 待重构
          this._selectComponentAndHighlightById(id);
        }
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
          if (!this.componentProfileMap[name]) {
            const profile = ins.default.extendOptions._profile_;
            this.componentProfileMap[name] = profile;
          }
          resolve(ins);
        });
      });
    },
    _loadWidgetScript(name, scope = "@banner-man") {
      const verison = this.widgetWersionMap[`${scope}/${name}`];
      const body_dom = document.body;
      return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.src = `http://122.51.85.144:6060/packgages/${scope}/${name}@${verison}/index.js`;
        if (name === "widget-banner") {
          script.src = "http://localhost:8800/index.js";
        }
        script.id = `${name}@${verison}`;
        body_dom.appendChild(script);
        // script 加载完毕后调用方法
        script.onload = () => {
          const ins = this.$root.$options.components[name];
          if (!this.loadingCompleteStatusMap[name] && !!_BM_EDIT_RUNTIME_) {
            ins.mixin(SortElementMixin);
            this.loadingCompleteStatusMap[name] = true;
          }
          if (!this.componentProfileMap[name]) {
            const profile = ins.extendOptions._profile_;
            this.componentProfileMap[name] = profile;
          }
          resolve(ins);
        };
        script.onerror = reject;
      });
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      console.time("renderPageFromRemote");
      // const componentsModelTree =
      //   storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
      const _promiseArr = [];
      const _promiseMap = {};
      reqGetPageById(this.pageId).then(res => {
        const componentsModelTree = res.data.data || [];
        this.widgetWersionMap = res.data.widgets_version;
        traversal(componentsModelTree, node => {
          if (!node.props) return;
          Object.keys(node.props).forEach(key => {
            const _val = node.props[key];
            node.props[key] = _val === UNDEFINED ? undefined : _val;
          });
          if (_promiseMap[node.name]) return;
          const promise = this._loadWidgetScript(node.name);
          _promiseMap[node.name] = true;
          _promiseArr.push(promise);
        });
        Promise.all(_promiseArr).then(res => {
          this.componentsModelTree = componentsModelTree;
          this.$nextTick(() => {
            console.timeEnd("renderPageFromRemote");
            this._setImageNodeUndraggable();
            this._drawWidgetsTree();
          });
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
      const _map = {};
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
        const _profile = getProfileByInstance(instance);
        const _obj = {
          children: [],
          top,
          name: _profile.name,
          id: _id
        };
        // 事件收集
        this.collectEvent(_profile.controllers, _id, instance);

        parent.children.push(_obj);
        componentModel.children &&
          componentModel.children.forEach(val => {
            walk(_obj, val);
          });

        _map[_id] = instance;
      }.bind(this);
      this.componentInstanceMap = _map;
      // debugger;
      this.componentsModelTree.forEach(val => {
        walk(_root, val);
      });
      return _root;
    },
    collectEvent(controllers, id, ins) {
      controllers.forEach(val => {
        if (val.controllerType === "CTRL_EMIT_EVENT") {
          this.emitEventMap[id] = ins[val.propName];
        }
        if (val.controllerType === "CTRL_ON_EVENT") {
          this.onEventList.push({
            propName: val.propName,
            handleName: val.handleName,
            ins
          });
        }
      });
    },
    _drawWidgetsTree() {
      console.time("_generateWidgetsTree");
      this._generateComponentModelMap();
      const _tree = this._generateWidgetsTree();
      console.timeEnd("_generateWidgetsTree");
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
    refreshSelectedId() {
      const _id = this.selectedId;
      this.selectedId = "";
      this.$nextTick(() => {
        this.selectedId = _id;
      });
    },
    _updateWidgetProp(data) {
      // 注意: 此时更新 props 必须是组件声明过的 props 才能得到更新,
      // 动态添加的 props 无法更新
      // 譬如读取历史生成的组件, 开发过程中再更改组件的 props 会出现此 bug
      const compObj = this._findComponentModelById(this.selectedId);
      this.selectedId = this.selectedId;
      if (!compObj) return;
      compObj.props[data.key] = data.value;
      selector.resetHighlight();
      this.refreshSelectedId();
    },
    getWidgetDataValue(key) {
      const vm = this.componentInstanceMap[this.selectedId];
      return vm[key];
    },
    getWidgetEmitEventMap() {
      return this.emitEventMap;
    },
    getSelectWidgetProfile() {
      if (!this.selectedId) return;
      const instance = this.componentInstanceMap[this.selectedId];
      return { ...getProfileByInstance(instance), id: this.selectedId } || {};
    },
    getWidgetProfileByName(name) {
      if (!name) return;
      return this.componentProfileMap[name] || {};
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
      return reqUpdatePage(this.pageId, this.componentsModelTree);
    },
    deployPage() {
      return reqBuildPage(this.pageId);
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
      this._selectComponentAndHighlightById(id);
    },
    viewportScrollTo(percent) {
      if (this.sorting) return;
      const rootContainerEl = this.$refs.rootContainer.$el;
      this.treeScrolling = true;
      const scroll_height = rootContainerEl.scrollHeight;
      const window_height = rootContainerEl.clientHeight;
      rootContainerEl.scrollTo({
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

