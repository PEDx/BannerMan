<template>
  <div class="container">
    <div :style="{width: `${leftWidth}px`, marginRight: `-${leftWidth}px`}" class="left">
      <left-panel></left-panel>
      <div class="drag">
        <el-button type="text" @mousedown.native="dragLeftStatus = true">
          <i class="el-icon-more"></i>
        </el-button>
      </div>
    </div>
    <div class="mid">
      <div :style="{margin: `0 ${ rightWidth}px 0 ${leftWidth}px`}" class="mid-content">
        <div :style="{width: `${viewSize[0]}px`,height: `${viewSize[1]}px`}" class="viewport">
          <transition name="fade">
            <div v-if="viewportLoading" class="mask">
              <div class="loading"></div>
            </div>
          </transition>
          <iframe
            style="width: 100%;height: 100%"
            src="/editer/viewport"
            frameborder="0"
            @load="handleLoad"
          ></iframe>
        </div>
      </div>
    </div>
    <div :style="{width: `${rightWidth}px`, marginLeft: `-${rightWidth}px`}" class="right">
      <div class="drag">
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
import throttle from "../../utils";
const EDITOR_LEFT_PANEL_MIN_WIDTH = 260;
const EDITOR_RIGHT_PANEL_MIN_WIDTH = 300;
export default {
  components: {
    "right-panel": rightPanel,
    "left-panel": leftPanel
  },
  data() {
    return {
      leftWidth: EDITOR_LEFT_PANEL_MIN_WIDTH,
      rightWidth: EDITOR_RIGHT_PANEL_MIN_WIDTH,
      dragLeftStatus: false,
      dragRightStatus: false,
      viewportLoading: true,
      viewSize: [375, 667]
    };
  },
  mounted() {
    document.addEventListener(
      "mousemove",
      throttle(e => {
        if (this.dragLeftStatus) {
          if (e.clientX <= EDITOR_LEFT_PANEL_MIN_WIDTH) return;
          this.leftWidth = e.clientX;
        }
        if (this.dragRightStatus) {
          const _wid = document.body.clientWidth - e.clientX;
          if (_wid <= EDITOR_RIGHT_PANEL_MIN_WIDTH) return;
          this.rightWidth = _wid;
        }
      }, 30)
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
}
.left,
.right {
  position: relative;
  float: left;
  height: 100%;
  background-color: #414146;
  outline: 1px solid #252527;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.52), 0 0 6px rgba(0, 0, 0, 0.04);
}
.right {
  float: right;
  .drag {
    position: absolute;
    top: 45%;
    left: -14px;
    transform: rotate(90deg);
    button {
      cursor: col-resize;
    }
  }
}
.left {
  overflow: hidden;
  position: relative;
  .drag {
    position: absolute;
    top: 45%;
    right: -14px;
    transform: rotate(90deg);
    button {
      cursor: col-resize;
    }
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
    .mask {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #1f1f2250;
    }
    .loading {
      position: absolute;
      top: 45%;
      left: 50%;
      width: 2em;
      height: 2em;
      margin-left: -1em;
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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

