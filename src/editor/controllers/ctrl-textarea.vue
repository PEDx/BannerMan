<template>
  <div class="ctrl-textarea">
    <el-input
      v-model="input"
      type="textarea"
      :autosize="{minRows: 2}"
      placeholder="请输入内容"
      @change="handleChange"
    ></el-input>
  </div>
</template>
<script>
export default {
  props: {
    value: String
  },
  data() {
    return {
      input: this.value
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
.ctrl-textarea {
  height: 100%;
}
</style>

