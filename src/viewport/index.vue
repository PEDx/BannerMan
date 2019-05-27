<template>
  <div
    class="content"
    @drop="handleDrop"
    @dragenter="handleDropon"
    @dragover="handleDropon"
    @dragleave="handleDropon"
  ></div>
</template>
<script>
import { debounce } from "../utils";
export default {
  mounted() {
    console.log("iframe");
    window.onresize = debounce(
      () => {
        console.log("iframe resize");
      },
      1000,
      {
        trailing: false
      }
    );
    document.addEventListener("mousemove", e => {
      // console.log("iframe mousemove");
      e.stopPropagation();
    });
  },
  methods: {
    handleDropon(e) {
      e.preventDefault();
    },
    handleDrop(e) {
      console.log(e);
      console.log(e.dataTransfer.getData("WIDGET_TYPE"));
      e.preventDefault();
    }
  }
};
</script>

<style scoped>
html,
body,
.content {
  height: 100%;
  background-color: #eee;
}
</style>

