<template>
  <div
    class="content"
    @drop="handleDrop"
    @dragenter="handleDropon"
    @dragover="handleDropon"
    @dragleave="handleDropon"
  >
    <Content/>
  </div>
</template>
<script>
import { debounce } from "../utils";
import Content from "./content";
export default {
  components: { Content },
  mounted() {
    window.onresize = debounce(() => {
      console.log("iframe resize");
    }, 1000);
  },
  methods: {
    handleDropon(e) {
      e.preventDefault();
    },
    handleDrop(e) {
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
    }
  }
};
</script>

<style scoped>
</style>

