<template>
  <div class="viewport-content">
    <component v-for="val in components" :is="val.name" :key="val.name" :props="val.props"></component>
  </div>
</template>
<script>
import { debounce } from "../utils/index";
import { stringify } from "../utils/index";
import WidgetSearch from "./widgetSearch";
export default {
  components: { WidgetSearch },
  data() {
    return {
      components: [{ name: "WidgetSearch", props: { width: 200 }}]
    };
  },
  mounted() {
    window.onresize = debounce(() => {
      console.log("iframe resize");
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
  methods: {}
};
</script>
<style lang="scss" scoped>
.viewport-content {
  -webkit-overflow-scrolling: touch;
}
</style>

