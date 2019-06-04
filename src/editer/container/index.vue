<template>
  <div class="container">
    <div :style="{width: `${leftWidth}px`, marginRight: `-${leftWidth}px`}" class="left">
      <left-panel></left-panel>
      <div class="drag-panel">
        <el-button type="text" @mousedown.native="dragLeftStatus = true">
          <i class="el-icon-more"></i>
        </el-button>
      </div>
    </div>
    <div class="mid">
      <div :style="{margin: `0 ${ rightWidth}px 0 ${leftWidth}px`}" class="mid-content">
        <div
          :style="{width: `${viewSize.width}px`,height: `${viewSize.height}px`,transform: `scale(${viewScale})`,transformOrigin: 'top'}"
          class="viewport"
        >
          <transition name="fade">
            <div v-if="viewportLoading" class="mask">
              <div class="loading"></div>
            </div>
          </transition>
          <transition name="fade">
            <div v-show="shotAnim" class="screenshotMask">
              <i class="el-icon-camera-solid"></i>
            </div>
          </transition>
          <transition name="scale" @after-leave="afterLeave" @after-enter="afterEnter">
            <div
              v-show="dragAnim"
              :style="{transformOrigin: `${percentage.x}% ${percentage.y}%`}"
              class="dragAnim"
            ></div>
          </transition>
          <iframe
            id="iframe-view"
            ref="iframe"
            name="viewport"
            :style="`width: 100%;height: 100%;pointer-events: ${draging ? 'none': 'auto'};outline: 1px solid #6b6b6b;box-sizing: border-box;`"
            src="/viewport"
            frameborder="0"
            @load="handleLoad"
          ></iframe>
        </div>
      </div>
    </div>
    <div :style="{width: `${rightWidth}px`, marginLeft: `-${rightWidth}px`}" class="right">
      <div class="drag-panel">
        <el-button type="text" @mousedown.native="dragRightStatus = true">
          <i class="el-icon-more"></i>
        </el-button>
      </div>
      <right-panel></right-panel>
    </div>
  </div>
</template>
<script>
import rightPanel from "./rightPanel";
import leftPanel from "./leftPanel";
import deviceModelList from "../device";
import { throttle, debounce } from "../../utils/index";
import EventBus from "../../bus";
const EDITOR_LEFT_PANEL_MIN_WIDTH = 260;
const EDITOR_RIGHT_PANEL_MIN_WIDTH = 300;
export default {
  components: {
    "right-panel": rightPanel,
    "left-panel": leftPanel
  },
  data() {
    const editerSetting = this.$store.state.editerSetting;
    return {
      leftWidth: +editerSetting.leftPanelWidth || EDITOR_LEFT_PANEL_MIN_WIDTH,
      rightWidth:
        +editerSetting.rightPanelWidth || EDITOR_RIGHT_PANEL_MIN_WIDTH,
      dragLeftStatus: false,
      dragRightStatus: false,
      viewportLoading: true,
      shotAnim: false,
      dragAnim: false,
      window_wid: document.body.clientWidth,
      percentage: {
        x: 0,
        y: 10
      }
    };
  },
  computed: {
    viewSize() {
      const editerSetting = this.$store.state.editerSetting;
      return deviceModelList[editerSetting.deviceType || "iphone6"].resolution;
    },
    draging() {
      return this.dragLeftStatus || this.dragRightStatus;
    },
    viewScale() {
      const editerSetting = this.$store.state.editerSetting;
      return (editerSetting.viewportScale / 100).toFixed(2);
    }
    // canNotMovePanel: function() {
    // const window_wid = document.body.clientWidth;
    // const panel_wid = this.leftWidth + this.rightWidth;
    // const device_wid = this.viewSize.width;
    // return panel_wid > window_wid - 20;
    // }
  },
  mounted() {
    EventBus.$on("screenshot-start", () => {
      this.shotAnim = true;
      setTimeout(() => {
        this.shotAnim = false;
      }, 500);
    });
    window.addEventListener(
      "message",
      e => {
        if (e.data.type === "drag-end") {
          this.percentage.x =
            (e.data.axis.x / this.viewSize.width).toFixed(6) * 100;
          this.percentage.y =
            (e.data.axis.y / this.viewSize.height).toFixed(6) * 100;
          this.dragAnim = true;
        }
      },
      false
    );
    window.onresize = debounce(
      () => {
        this.window_wid = document.body.clientWidth;
      },
      1000,
      true
    );
    document.addEventListener(
      "mousemove",
      throttle(e => {
        // const panel_wid = this.leftWidth + this.rightWidth;
        // if (panel_wid > this.window_wid) return;
        if (this.dragLeftStatus) {
          if (e.clientX <= EDITOR_LEFT_PANEL_MIN_WIDTH) return;
          this.leftWidth = e.clientX;
          this.$store.dispatch("update_lt_wid", e.clientX);
          EventBus.$emit("reset-fold-bar");
        }
        if (this.dragRightStatus) {
          const _wid = document.body.clientWidth - e.clientX;
          if (_wid <= EDITOR_RIGHT_PANEL_MIN_WIDTH) return;
          this.rightWidth = _wid;
          this.$store.dispatch("update_rt_wid", _wid);
        }
      }, 40)
    );
    document.addEventListener("mouseup", () => {
      this.dragLeftStatus = false;
      this.dragRightStatus = false;
    });
  },
  methods: {
    toggleLeftPannel() {
      this.leftWidth = !this.leftWidth ? EDITOR_LEFT_PANEL_MIN_WIDTH : 0;
    },
    toggleRightPannel() {
      this.rightWidth = !this.rightWidth ? EDITOR_RIGHT_PANEL_MIN_WIDTH : 0;
    },
    handleLoad() {
      this.viewportLoading = false;
    },
    afterEnter() {
      this.dragAnim = false;
    },
    afterLeave() {
      // this.dragAnim = false;
    }
  }
};
</script>
<style scoped lang="scss">
// #c9a11c
// #ef9319
.container {
  position: relative;
  overflow: hidden;
  height: 100%;
  color: #eee;
  font-size: 12px;
  .left,
  .right {
    position: relative;
    float: left;
    height: 100%;
    background-color: #414146;
    outline: 1px solid #252527;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.52), 0 0 6px rgba(0, 0, 0, 0.04);
  }
  .drag-panel {
    position: absolute;
    top: 45%;
    transform: rotate(90deg);
    button {
      cursor: col-resize;
    }
  }
  .right {
    float: right;
    .drag-panel {
      left: -14px;
    }
  }
  .left {
    overflow: hidden;
    .drag-panel {
      right: -14px;
    }
  }
  .top-bar {
    height: 20px;
    width: 100%;
    line-height: 20px;
    border-bottom: 1px solid #313134;
    box-sizing: border-box;
    padding: 0 5px;
    overflow: hidden;
    .title {
      float: left;
    }
  }
  .mid {
    float: left;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
        45deg,
        #666 25%,
        transparent 0,
        transparent 75%,
        #666 0,
        #666
      ),
      linear-gradient(
        45deg,
        #666 25%,
        transparent 0,
        transparent 75%,
        #666 0,
        #666
      );
    background-position: 0 0, 8px 8px;
    background-size: 16px 16px;
    background-color: #444;
    .mid-content {
      height: 100%;
      box-sizing: border-box;
      padding: 30px 0;
      overflow-y: auto;
      overflow-x: hidden;
      // transition: all 0.5s;
    }
    .viewport {
      position: relative;
      margin: 0 auto;
      background: rgb(73, 69, 69);
      overflow: hidden;
      box-shadow: 0 2px 20px rgba(0, 0, 0, 0.42), 0 0 24px rgba(0, 0, 0, 0.04);
      border-radius: 2px;
      transition: all 0.3s ease;
      .screenshotMask,
      .mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #1f1f2250;
      }
      .screenshotMask {
        background-color: #ffffff8e;
        i {
          position: absolute;
          top: 45%;
          left: 50%;
          font-size: 40px;
          margin-left: -20px;
        }
      }
      .dragAnim {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9;
        background-color: #c5c5c50a;
        border: 2px solid #f3f3f32d;
        box-sizing: border-box;
      }
      .loading {
        position: absolute;
        top: 45%;
        left: 50%;
        width: 2em;
        height: 2em;
        margin-left: -1.5em;
        border: 3px solid rgb(251, 49, 113);
        overflow: hidden;
        animation: spin 3s ease infinite;
        &::before {
          content: "";
          position: absolute;
          width: 2em;
          height: 2em;
          background-color: rgba(251, 49, 113, 0.75);
          transform-origin: center bottom;
          transform: scaleY(0);
          animation: fill 3s linear infinite;
        }
      }
    }
  }
}

@keyframes spin {
  50%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fill {
  50%,
  75% {
    transform: scaleY(1);
  }
  100% {
    transform: scaleY(0);
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1);
    transform: scale3d(0.1, 0.1, 0.1);
  }
  40% {
    opacity: 1;
    -webkit-transform: scale3d(0.12, 0.12, 0.12);
    transform: scale3d(0.12, 0.12, 0.12);
  }
}

.zoomIn {
  -webkit-animation-name: zoomIn;
  animation-name: zoomIn;
}

.scale-enter-active,
.scale-leave-active {
  animation: zoomIn 0.3s;
}
.scale-enter,
.scale-leave-to {
  opacity: 0;
}
</style>

