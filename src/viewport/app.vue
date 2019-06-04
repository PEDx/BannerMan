<template>
  <div class="viewport-content">
    <component
      v-for="(val, idx) in componentList"
      :is="val.name"
      :key="`${val.name}-${idx}`"
      v-bind="val.props"
      @click.native="selectComponent(idx)"
    ></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import widgets from "../widgets";

const widgetMap = {};
Object.keys(widgets).forEach(key => (widgetMap[key] = widgets[key].component));
export default {
  components: widgetMap,
  data() {
    return {
      componentList: [],
      index: 0
    };
  },
  mounted() {
    window._CURRENT_VIEWPORT_VUE_INSTANCE_ = this;
    window.onresize = debounce(() => {
      this._setMeta(document.body.clientWidth);
    }, 1000);
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
        this._addComponent("widget-search");
      }
      e.preventDefault();
    });
  },
  methods: {
    selectComponent(idx) {
      const vm = this.$children[idx];
      this.index = idx;
      window.parent.postMessage({
        type: "select-component",
        profile: vm._profile_
      });
    },
    _addComponent(widgetName, idx) {
      const widget = widgets[widgetName];
      const _obj = {};
      widget.profile.controllers.forEach(val => {
        _obj[val.propName] = undefined;
      });
      this.componentList.push({
        name: widgetName,
        props: _obj
      });
    },
    _deleteComponent(idx) {
      this.componentList.splice(idx, 1);
    },
    updateWidgetProp(key, value) {
      const compList = this.componentList[this.index];
      compList.props[key] = value;
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
<style lang="scss" scoped>
.viewport-content {
  -webkit-overflow-scrolling: touch;
}
</style>

