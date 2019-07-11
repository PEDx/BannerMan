<template>
  <div class="ctrl-text-input">
    <el-input v-model="input" placeholder="请输入内容" @change="handleChange"></el-input>
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
.ctrl-text-input {
  height: 100%;
}
</style>

