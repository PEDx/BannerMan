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
import { debounce, stringify } from "../utils/index";
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
      // console.log("iframe resize");
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
          },
          instance: stringify(this)
        });
      }
      e.preventDefault();
    });
  },
  methods: {
    selectComponent(idx) {
      console.log(idx);
      window._CURRENT_SELECTED_VUE_WIDGET_INSTANCE_ = this.componentList[idx];
    }
  }
};
</script>
<style lang="scss" scoped>
.viewport-content {
  -webkit-overflow-scrolling: touch;
}
</style>

