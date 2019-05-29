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

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
