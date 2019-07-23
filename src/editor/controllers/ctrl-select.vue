<template>
  <div class="ctrl-select">
    <el-select v-model="input" placeholder="请选择">
      <el-option
        v-for="item in setting.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    setting: Object
  },
  data() {
    return {
      input: null
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
.ctrl-select {
  height: 100%;
}
</style>

