<template>
  <div class="bottom-bar">
    <div class="editer-version-info">
      <span class="right">thruster-build-v0.0.1-beta</span>
    </div>
    <div class="return">
      <el-button type="text" @click="initScale">
        <i class="el-icon-refresh-left"></i>
      </el-button>
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
  .editer-version-info {
    float: left;
  }
  .return {
    float: right;
  }
  .slider {
    position: relative;
    width: 160px;
    height: 100%;
    float: right;
  }
}
</style>

