<template>
  <div class="viewport-content" ref="viewportContent">
    <component
      v-for="(val, idx) in componentStack"
      :is="val.name"
      :key="`${idx}-${val.name}`"
      v-bind="val.props"
    ></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import storage from "../utils/storage";
import ComponentSelector from "./component-selector";
import widgets from "../widgets";
import EventBus from "../bus";
const selector = new ComponentSelector();
const LOCAL_SAVE_KEY = "current_viewport_data";
const AUTO_SAVE_TIME = 5 * 60 * 1000;
export default {
  components: widgets,
  data() {
    return {
      componentStack: [], // 组件数据模型, 在此分发传入各个组件的 props
      index: 0
    };
  },
  mounted() {
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
    EventBus.$on("element-selected", instance => {
      this.index = this._findComponentIdx(instance);
      const component = this.componentStack[this.index];
      window.parent.postMessage({
        type: "select-component",
        profile: instance._profile_,
        name: component.name
      });
    });

    this._observerGeometric();
  },
  methods: {
    // 监听元素几何属性变化
    _observerGeometric() {
      const MutationObserver =
        window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
      // IE 11 及以上兼容
      const mutationObserver = new MutationObserver(function(
        mutations,
        observer
      ) {
        console.log("viewport attr changed");
        // 重置高亮
        selector.resetHighlight();
      });
      mutationObserver.observe(this.$refs.viewportContent, {
        subtree: true,
        attributes: true
      });
    },
    _findComponentIdx(ins) {
      let ret = 0;
      this.$children.forEach((val, idx) => {
        if (val === ins) ret = idx;
      });
      return ret;
    },
    // 第一次添加组件会是异步加载
    _asyncAddComponent(widgetName, idx) {
      const widget = widgets[widgetName];
      widget().then(ins => {
        const profile = ins.default.prototype._profile_;
        const _obj = {};
        profile.controllers.forEach(val => {
          _obj[val.propName] = void 0;
        });

        this.componentStack.push({
          name: widgetName,
          props: _obj
        }); // 在此初始化组件
        this.$nextTick(() => {
          window.parent.postMessage({
            type: "flush-component-tree"
          });
        });
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
      const vm = this.$children[this.index];
      return vm[key];
    },
    // 清空编辑页面
    clearPage() {
      this.componentStack = [];
      selector.clearHighlight();
    },
    // 保存编辑页面数据对象模型
    savePage() {
      storage.set(LOCAL_SAVE_KEY, this.componentStack);
    },
    // 自动保存
    autoSave() {
      setInterval(this.savePage, AUTO_SAVE_TIME);
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

