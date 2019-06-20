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
  font: 12px/1.14 "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.f-toe {
  overflow: hidden;
  word-wrap: normal;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.f-fl {
  float: left;
}
.f-fr {
  float: right;
}
</style>
