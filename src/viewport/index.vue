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
export default {
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

