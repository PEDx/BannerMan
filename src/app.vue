<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import { findQualifiedChildrenFromList } from "./backend/index";
export default {
  name: "App",
  mounted() {
    // const instence = findQualifiedChildrenFromList([this]);
    // console.log(instence);
    // console.log(this);
  }
};
</script>

<style lang="scss">
html,
body {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
