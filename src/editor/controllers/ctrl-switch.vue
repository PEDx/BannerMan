<template>
  <div class="ctrl-switch">
    <el-switch v-model="input" active-color="#fd9527" inactive-color="#898989"></el-switch>
  </div>
</template>
<script>
export default {
  props: {
    value: Boolean
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
.ctrl-switch {
  height: 100%;
}
</style>

