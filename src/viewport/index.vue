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
    window.onresize = debounce(
      () => {
        console.log("iframe resize");
      },
      1000
    );
  },
  methods: {
    handleDropon(e) {
      e.preventDefault();
    },
    handleDrop(e) {
      console.log(e.dataTransfer.getData("WIDGET_TYPE"));
      e.preventDefault();
    }
  }
};
</script>

<style scoped>
</style>

