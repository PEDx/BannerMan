<template>
  <div class="bottom-bar">
    <div class="editer-version-info">
      <span class="right">thruster-build-v0.0.1-beta</span>
    </div>
    <div class="return">
      <el-button type="text" title="还原" @click="initScale">
        <i class="el-icon-refresh-left"></i>
      </el-button>
    </div>
    <div class="scaler">
      <span class="demonstration">缩放</span>
      <div class="number">
        <input v-model.number="rangeValue" type="number" @change="handleInputChange">
      </div>
      <div class="slider">
        <el-slider
          v-model="rangeValue"
          :min="0"
          :max="200"
          :format-tooltip="formatTooltip"
          @change="handleChange"
        ></el-slider>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rangeValue: +this.$store.state.editerSetting.viewportScale || 100
    };
  },
  methods: {
    formatTooltip(val) {
      return `${val}%`;
    },
    handleChange() {
      this.$store.dispatch("update_viewport_scale", this.rangeValue);
    },
    handleInputChange() {
      if (this.rangeValue > 200) this.rangeValue = 200;
      if (this.rangeValue < 0) this.rangeValue = 0;
      this.handleChange();
    },
    initScale() {
      this.$store.dispatch("update_viewport_scale", 100);
      this.rangeValue = 100;
    }
  }
};
</script>
<style lang="scss" scoped>
.bottom-bar {
  height: 100%;
  text-align: left;
  overflow: hidden;
  color: #eee;
  line-height: 20px;
  .editer-version-info {
    float: left;
    height: 100%;
    padding-left: 8px;
  }
  .return {
    float: right;
  }
  .scaler {
    float: right;
    // overflow: hidden;
    .demonstration {
      margin-right: 8px;
    }
    .number {
      float: right;
      margin-left: 8px;
      input {
        -webkit-appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #606266;
        display: inline-block;
        font-size: inherit;
        height: 16px;
        line-height: 16px;
        outline: none;
        padding: 0 4px;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        width: 40px;
        text-align: center;
        &::-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
    }
    .slider {
      width: 160px;
      height: 100%;
      float: right;
    }
  }
}
</style>

