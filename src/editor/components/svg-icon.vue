<template>
  <svg aria-hidden="true" class="svg-icon">
    <use
      :xlink:href="iconName"
      :style="{
        fill: color
    }" />
  </svg>
</template>
<script>
export default {
  name: "SvgIcon",
  props: {
    icon: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    color: {
      type: String,
      default: "#eee"
    }
  },
  computed: {
    iconName() {
      return `#bm-svg-${this.icon}`;
    }
  }
};
</script>
<style lang="scss" scoped>
.svg-icon {
  display: inline-block;
  width: 28px;
  height: 29px;
  svg {
    fill: #fff;
  }
}
</style>

