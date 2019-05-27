<template>
  <div class="bottom-bar">
    <el-row>
      <el-col :span="8" class="lock-layout">
        <el-button
          :class="{'lock': lockStatus}"
          type="text"
          title="锁定"
          style="marginLeft: -8px;"
          @click="lockLayout"
        >
          <i :class="{'el-icon-lock': lockStatus, 'el-icon-s-home': !lockStatus}"></i>
          {{ lockStatus ? '' : '' }}
        </el-button>
      </el-col>
      <el-col :span="8" style="textAlign: center;">
        <div class="scaler">
          <span class="demonstration">缩放</span>
          <div class="return">
            <el-button type="text" title="还原" @click="initScale">
              <i class="el-icon-refresh-left"></i>
            </el-button>
          </div>
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
      </el-col>
      <el-col :span="8" style="textAlign: right;">
        <div class="editer-version-info">
          <span class="right">thruster-build-v0.0.1-beta</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rangeValue: +this.$store.state.editerSetting.viewportScale || 100,
      lockStatus: false
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
    },
    lockLayout() {
      this.lockStatus = !this.lockStatus;
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
  padding: 0 8px;
  box-sizing: border-box;
  .lock-layout {
    i {
      font-size: 14px;
    }
    .lock {
      color: rgb(170, 85, 43);
    }
  }
  .editer-version-info {
    height: 100%;
    color: rgb(170, 85, 43);
    // color: #d94b09;
  }

  .scaler {
    display: inline-block;
    .return {
      float: right;
      i {
        font-size: 14px;
      }
    }
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

