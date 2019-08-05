<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import layout from "./layout/index";
export default {
  name: "App",
  components: {
    layout
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
  overflow: hidden;
}
#app {
  height: 100%;
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
.f-cb:after,
.f-cbli li:after {
  display: block;
  clear: both;
  visibility: hidden;
  height: 0;
  overflow: hidden;
  content: ".";
}
.f-cb,
.f-cbli li {
  zoom: 1;
}
@keyframes spin {
  50%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fill {
  50%,
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 1);
    transform: scale3d(0.1, 0.1, 1);
  }
  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.zoomIn {
  -webkit-animation-name: zoomIn;
  animation-name: zoomIn;
}

.scale-enter-active {
  animation: zoomIn 0.3s;
}
.scale-leave-active {
  animation: zoomIn 0.3s reverse;
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
}
</style>
