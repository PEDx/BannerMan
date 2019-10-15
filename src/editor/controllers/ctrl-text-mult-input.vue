<template>
  <div class="ctrl-text-input">
    <el-input
      v-model="input[idx]"
      placeholder="请输入内容"
      v-for="(num, idx) in relationValue"
      :key="idx"
    ></el-input>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: () => [],
      type: Array
    },
    relationValue: {
      default: 2,
      type: Number
    }
  },
  data() {
    return {
      input: Array.from(
        { length: this.relationValue },
        (v, k) => this.value[k] || `标签${k + 1}`
      )
    };
  },
  watch: {
    input() {
      console.log("mult");
      this.$emit("submit-update", this.input);
    },
    relationValue(nv, ov) {
      if (nv === ov) return;
      this.input = Array.from(
        { length: this.relationValue },
        (v, k) => this.value[k] || `标签${k + 1}`
      );
    }
  },
  created() {
    this.$emit("submit-update", this.input);
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.ctrl-text-input {
  height: 100%;
}
</style>

