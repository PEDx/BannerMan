<template>
  <div class="ctrl-slider-input">
    <el-row :gutter="10">
      <el-col :span="18">
        <el-slider
          :value="rangeValue"
          :min="setting.range.min"
          :max="setting.range.max"
          @input="handleInput"
        ></el-slider>
      </el-col>
      <el-col :span="6">
        <el-input
          v-model="input"
          placeholder="请输入内容"
          @change="handleChange"
          :min="setting.range.min"
          :max="setting.range.max"
        ></el-input>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    value: String | Number,
    setting: {
      type: Object,
      default: () => ({
        range: {}
      })
    }
  },

  data() {
    return {
      input: this.value
    };
  },
  computed: {
    rangeValue() {
      return +this.input;
    }
  },
  watch: {
    input() {
      this.$emit("submit-update", +this.input);
    }
  },
  methods: {
    handleChange() {},
    handleInput(value) {
      this.input = value;
    }
  }
};
</script>
<style lang="scss" scoped>
.ctrl-slider-input {
  height: 100%;
}
</style>

