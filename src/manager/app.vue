<template>
  <div id="app">
    <layout />
  </div>
</template>

<script>
import Layout from "./layout/layout";
export default {
  components: { Layout }
};
</script>

<style lang="scss">
.el-menu-item.is-active svg {
  fill: #f18100;
}
.check {
  text-decoration: underline;
  color: #f18100;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 12px;
}
.el-form-item__label {
  font-size: 13px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 140px;
}
.el-range-editor--small.el-input__inner {
  width: 280px;
}
.el-date-editor .el-range-separator {
  padding: 0;
}
.el-col {
  min-height: 45px;
}
.el-input.is-disabled .el-input__inner {
  color: #6f7279;
}
.describe-title {
  font-size: 14px;
  color: #5f6573;
}

.describe {
  overflow: hidden;
  margin-bottom: 20px;
  line-height: 32px;
  padding: 5px 10px;
  background-color: #fff2e4;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.check {
  text-decoration: underline;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 10px;
}
.el-dropdown-menu--small .el-dropdown-menu__item {
  padding: 0px;
  text-align: center;
}
.el-input__inner {
  padding-left: 10px;
}
</style>
