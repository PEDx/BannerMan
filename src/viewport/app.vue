<template>
  <div class="viewport-content">
    <component
      v-for="(val, idx) in componentArrInPage"
      :is="val.name"
      :key="`${idx}-${val.name}`"
      v-bind="val.props"
      @click.native="selectComponent(idx)"
    ></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import ComponentSelector from "../utils/component-selector";
import widgets from "../widgets";

const widgetComponentMap = {};
Object.keys(widgets).forEach(
  key => (widgetComponentMap[key] = widgets[key].component)
);
export default {
  components: widgetComponentMap,
  data() {
    return {
      componentArrInPage: [],
      index: 0
    };
  },
  mounted() {
    const selector = new ComponentSelector();
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;
    window.onresize = debounce(() => {
      this._setMeta(document.body.clientWidth);
    }, 1000);
    document.addEventListener("mouseenter", selector.startSelecting);
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
        Array(20).fill(0).forEach(() => this._addComponent("widget-search"))
      }
      e.preventDefault();
    });
  },
  methods: {
    selectComponent(idx) {
      const compObj = this.componentArrInPage[idx];
      const widget = widgets[compObj.name];
      this.index = idx;
      window.parent.postMessage({
        type: "select-component",
        profile: widget.profile,
        name: compObj.name
      });
    },
    _addComponent(widgetName, idx) {
      const widget = widgets[widgetName];
      const _obj = {};
      widget.profile.controllers.forEach(val => {
        _obj[val.propName] = void 0;
      });
      this.componentArrInPage.push({
        name: widgetName,
        props: _obj
      });
    },
    _deleteComponent(idx) {
      this.componentArrInPage.splice(idx, 1);
    },
    updateWidgetProp(key, value) {
      const compObj = this.componentArrInPage[this.index];
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
        metaContent = `width=${baseWidth}, user-scalable=no, target-densitydpi=device-dpi`;
      }
      meta.setAttribute("name", "viewport");
      meta.setAttribute("content", metaContent);
      document.getElementsByTagName("head")[0].appendChild(meta);
    }
  }
};
</script>
<style lang="scss">

</style>

