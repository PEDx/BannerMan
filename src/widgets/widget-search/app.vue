<template>
  <div class="widget-search">
    <input
      v-model="value"
      type="text"
      :style="{width: `${width}px`, height: `${height}px`}"
      @click="handleClick"
    >
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
  mounted() {
  },
  methods: {
    handleClick() {}
  }
};
</script>
<style lang="scss" scoped>
.widget-search {
  box-sizing: border-box;
  padding: 0 10px;
}
input {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: none;
  padding: 0 15px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>

