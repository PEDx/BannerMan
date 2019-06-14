<template>
  <div class="bottom-bar">
    <el-row>
      <el-col :span="8" class="lock-layout">
        <el-button type="text" title="生成截图" style="marginLeft: -8px;" @click="handleClick">
          <i class="el-icon-camera-solid"></i>
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
          <span class="right">Banner Man build-v0.0.1</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import * as rasterizeHTML from "rasterizehtml";
import deviceModelList from "./device";
import { throttle } from "../utils/index";
import EventBus from "../bus";
export default {
  data() {
    const editerSetting = this.$store.state.editer.setting;
    return {
      rangeValue: +editerSetting.viewportScale || 100,
      notfClose: true
    };
  },
  computed: {
    device() {
      const editerSetting = this.$store.state.editer.setting;
      return deviceModelList[editerSetting.deviceType || "iphone6"].resolution;
    }
  },
  created() {
    this.handleClick = throttle(this.getScreenshot, 3000, {
      leading: true
    });
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
    getScreenshot() {
      if (!this.notfClose) return;
      this.notfClose = false;
      const node = document.getElementById("iframe-view").contentDocument;
      const canvas = document.createElement("canvas");
      canvas.width = this.device.width;
      canvas.height = node.body.clientHeight;
      EventBus.$emit("screenshot-start");
      rasterizeHTML
        .drawDocument(node, canvas)
        .then(data => {
          this.$notify({
            title: "截图预览",
            dangerouslyUseHTMLString: true,
            message: `<div id="screenshot-content" style="border: 1px solid #fd9527;font-size: 0;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);height: ${
              this.device.height
            }px;overflow-y: scroll;overflow-x: hidden;"></div>`,
            duration: 1000,
            showClose: false,
            position: "bottom-right",
            onClose: () => {
              this.notfClose = true;
              this.downloadImg(canvas.toDataURL("image/jpeg"));
            }
          });
          document.getElementById("screenshot-content").appendChild(canvas);
        })
        .catch(error => {
          console.error(error);
        });
    },
    downloadImg(url) {
      var link = document.createElement("a");
      link.download = `thruster_screenshot_${new Date().getTime()}.png`;
      link.href = url;
      link.click();
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
      color: #fd9527;
    }
  }
  .editer-version-info {
    height: 100%;
    color: #fd9527;
    font-weight: 900;
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
        background-color: #252525;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #898989;
        box-sizing: border-box;
        color: #fd9527;
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

