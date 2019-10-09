<template>
  <div class="ctrl-color-picker">
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
      color: "#fff"
    };
  },
  watch: {
    color() {
      this.$emit("submit-update", this.color);
    }
  },
  created() {
    this.color = this.value;
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-color-picker {
  height: 100%;
}
</style>

