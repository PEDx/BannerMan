<template>
  <div class="viewport-content" ref="viewportContent">
    <component
      v-for="(val, idx) in componentStack"
      :is="val.name"
      :key="`${idx}-${val.name}`"
      v-bind="val.props"
      @click.native="selectComponent(idx)"
    ></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import ComponentSelector from "./component-selector";
import widgets from "../widgets";
import EventBus from "../bus";
const selector = new ComponentSelector();
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
      selector.highlightMouseoverElement();
      selector.highlightSelectedElement();
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
        window.parent.postMessage({
          type: "drag-end",
          axis: {
            x: e.x,
            y: e.y
          }
        });
        Array(20)
          .fill(0)
          .forEach(() => this._asyncAddComponent("widget-search"));
      }
    });
    Array(20)
      .fill(0)
      .forEach(() => this._asyncAddComponent("widget-search"));
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
        selector.highlightMouseoverElement();
        selector.highlightSelectedElement();
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

