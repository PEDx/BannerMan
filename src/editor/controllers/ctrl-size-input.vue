<template>
  <div class="ctrl-size-input">
    <el-row>
      <el-col :span="12">
        <span class="label">{{ setting.label[0] }}:</span>
        <el-input-number
          v-model="width"
          @change="handleChange"
          controls-position="right"
          :min="0"
          :max="400"
        ></el-input-number>
      </el-col>
      <el-col :span="12">
        <span class="label">{{ setting.label[1] }}:</span>
        <el-input-number
          v-model="height"
          @change="handleChange"
          controls-position="right"
          :min="0"
          :max="400"
        ></el-input-number>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    value: { type: Array, default: () => [] },
    setting: {
      type: Object,
      default: () => ({
        label: ["宽", "高"]
      })
    }
  },
  data() {
    return {
      width: this.value[0],
      height: this.value[1]
    };
  },
  watch: {
    width() {
      this.$emit("submit-update", [this.width, this.height]);
    },
    height() {
      this.$emit("submit-update", [this.width, this.height]);
    }
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-size-input {
  height: 100%;
  .item {
    display: inline-block;
  }
  .text {
    padding: 0 4px;
  }
  .label {
    color: #7f7c87;
  }
}
</style>

