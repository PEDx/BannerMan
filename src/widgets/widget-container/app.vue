<template>
  <div class="widget-container">
    <button class="el-button" @click="handleClick">el-button</button>
  </div>
</template>
<script>
// this.$emit("change-prop", {
//   width: 134
// });
// 注意：
// 1. 编辑器监听此事件只是暴露 props 控制权给组件（正在编辑的）自己，使之更灵活，组件可以自我设置传入 props
// 2. 此处设置的 props 将和右边 参数控制器 的数值同步
// 3. 非编辑器环境没有此事件监听，请勿在业务逻辑中依赖

export default {
  props: {
    width: {
      default: 100,
      type: Number
    },
    height: {
      default: 40,
      type: Number
    }
  },
  data() {
    return {
      value: ""
    };
  },
  mounted() {},
  methods: {
    handleClick() {}
  }
};
</script>
<style lang="scss" scoped>
.widget-container {
  box-sizing: border-box;
  padding: 0 10px;
}
.el-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
</style>

