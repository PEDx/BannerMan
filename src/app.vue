<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
html,
body,
#app {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
.el-select--mini {
  .el-input--mini .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
  .el-input__icon {
    height: 14px;
  }
  .el-input__suffix {
    height: 14px;
    top: 3px;
  }
  .el-input--mini .el-input__icon {
    line-height: 14px;
  }
  .el-input__prefix{
    top: 4px;
    color: #343438;
  }
}
.el-select-dropdown__item{
  font-size: 12px;
  height: 28px;
  padding: 0 10px;
}
</style>
