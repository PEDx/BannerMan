<template>
  <div class="ctrl-rich-text">
    <el-button type="primary" icon="el-icon-edit-outline" circle></el-button>
  </div>
</template>
<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      input: ""
    };
  },
  watch: {
    input() {
      this.$emit("submit-update", this.input);
    }
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-rich-text {
  height: 100%;
}
</style>

