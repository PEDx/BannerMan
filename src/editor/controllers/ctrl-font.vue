<template>
  <div class="ctrl-font">
    <div class="item box">
      <div class="size item">
        <el-input-number
          style="width: 80px"
          v-model="font.size"
          @change="handleChange"
          controls-position="right"
          :min="0"
          :max="400"
          label="描述文字"
        ></el-input-number>
      </div>
      <div class="weight item">
        <el-select v-model="font.weight" placeholder="字体粗细" style="width: 110px">
          <el-option v-for="(val, key) in options" :key="val" :label="key" :value="val"></el-option>
        </el-select>
      </div>
    </div>
    <div class="color item">
      <el-color-picker v-model="font.color" show-alpha color-format="rgb"></el-color-picker>
    </div>
  </div>
</template>
<script>
// 文字控制,大小 粗细 颜色
export default {
  props: {
    value: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    this.options = {
      Thin: 100,
      "Extra Light": 200,
      Light: 300,
      Regular: 400,
      Medium: 500,
      "Semi Bold": 600,
      Bold: 700,
      "Extra Bold": 800,
      Heavy: 900
    };
    return {
      font: {}
    };
  },
  watch: {
    font: {
      deep: true,
      handler: function() {
        this.$emit("submit-update", this.font);
      }
    }
  },
  created() {
    this.font = this.value;
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-font {
  height: 100%;
  .box {
    box-sizing: border-box;
    padding-top: 4px;
  }
  .item {
    height: 31px;
    float: left;
    padding-right: 8px;
  }
}
</style>

