<template>
  <div class="viewport-content">
    <component
      v-for="(val, idx) in componentList"
      :is="val.name"
      :key="val.name"
      v-bind="val.props"
      @click.native="selectComponent(idx)"
    ></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import widgets from "../widgets";
export default {
  components: widgets,
  data() {
    return {
      componentList: [{ name: "widget-search", props: { width: undefined } }]
    };
  },
  mounted() {
    window.onresize = debounce(() => {
      this.setMeta(document.body.clientWidth);
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
      }
      e.preventDefault();
    });
  },
  methods: {
    selectComponent(idx) {
      window._CURRENT_SELECTED_VUE_WIDGET_INSTANCE_ = this.$children[idx];
      window.parent.postMessage({
        type: "select-component"
      });
    },
    setMeta(baseWidth) {
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

