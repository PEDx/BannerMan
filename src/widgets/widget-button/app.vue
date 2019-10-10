<template>
  <div class="widget-button">
    <button
      class="button"
      @click="handleClick"
      :style="{
        borderRadius: `${borderRadius}px`,
        backgroundColor: btnBgImg.url ? 'transparent' : '#fff'
      }"
    >
      <div
        class="wrap"
        :style="{
          width: `${size[0]}px`,
          height: `${size[1]}px`,
          lineHeight: `${size[1]}px`,
          background: btnBgImg.url ? `url(${btnBgImg.url}) ${btnBgImg.imgRepeat || ''}` : btnBgColor,
          backgroundSize: btnBgImg.imgSize || '',
          color: btnTextColor,
          borderRadius: `${borderRadius}px`,
          border: `${borderObj.width}px solid ${borderObj.color}`
        }"
      >{{ btnText }}</div>
    </button>
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
    size: {
      default: () => [200, 40],
      type: Array
    },
    borderRadius: {
      default: 4,
      type: Number
    },
    borderObj: {
      default: () => ({}),
      type: Object
    },
    btnBgImg: {
      default: () => ({}),
      type: Object
    },
    btnBgColor: {
      default: "#fff",
      type: String
    },
    btnTextColor: {
      default: "#333",
      type: String
    },
    btnText: {
      default: "按钮",
      type: String
    }
  },
  data() {
    return {
      value: ""
    };
  },
  mounted() {},
  methods: {
    handleClick() {
      this.$emit("widget-event", {
        type: "WIDGET_BUTTON_CLICK"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.widget-button {
  padding: 0 10px;
  text-align: center;
  font-size: 0;
}
.button {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  border: 0;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 0;
  .wrap {
    display: inline-block;
    font-size: 14px;
    &:active {
      opacity: 0.9;
    }
  }
}
</style>

