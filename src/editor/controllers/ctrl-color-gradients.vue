<template>
  <div class="ctrl-color-gradients">
    <el-color-picker v-model="color" show-alpha color-format="rgb"></el-color-picker>
  </div>
</template>
<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      color: "#fd9527"
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
}
</style>

