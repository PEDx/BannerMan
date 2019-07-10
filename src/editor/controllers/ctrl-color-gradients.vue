<template>
  <div class="ctrl-color-gradients">
    <el-color-picker v-model="colorOne" show-alpha color-format="rgb"></el-color-picker>
    <div class="color-gradients">
      <span
        class="color-view"
        :style="{ background: `linear-gradient(${ direction }deg, ${ colorOne }, ${ colorTwo })`}"
      ></span>
    </div>
    <el-color-picker v-model="colorTwo" show-alpha color-format="rgb"></el-color-picker>
  </div>
</template>
<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      colorOne: "#fd9527",
      colorTwo: "#39fd57",
      direction: 90
    };
  },
  watch: {
    color() {
      this.$emit("submit-update", this.color);
    }
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-color-gradients {
  height: 100%;
  display: flex;
  .color-gradients {
    position: relative;
    flex: 1;
    display: inline-block;
    height: 28px;
    line-height: 28px;
    border: 1px solid #898989;
    border-radius: 4px;
    text-align: center;
    padding: 4px;
    box-sizing: border-box;
    .color-view {
      position: relative;
      border-radius: 2px;
      display: inline-block;
      height: 18px;
      width: 100%;
    }
    .handle {
      position: absolute;
      left: 0px;
      width: 100%;
    }
  }
}
</style>

