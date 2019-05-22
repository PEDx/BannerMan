<template>
  <div class="container">
    <div :style="{width: `${leftWidth}px`, marginRight: `-${leftWidth}px`}" class="left">
      <left-panel></left-panel>
    </div>
    <div class="mid">
      <div :style="{margin: `0 ${ rightWidth}px 0 ${leftWidth}px`}" class="mid-content"></div>
    </div>
    <div :style="{width: `${rightWidth}px`, marginLeft: `-${rightWidth}px`}" class="right">
      <right-panel></right-panel>
    </div>
  </div>
</template>
<script>
import rightPanel from "./rightPanel";
import leftPanel from "./leftPanel";
export default {
  components: {
    "right-panel": rightPanel,
    "left-panel": leftPanel
  },
  data() {
    return {
      leftWidth: 230,
      rightWidth: 230
    };
  },
  methods: {
    toggleLeftPannel() {
      this.leftWidth = !this.leftWidth ? 230 : 0;
    },
    toggleRightPannel() {
      this.rightWidth = !this.rightWidth ? 230 : 0;
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  position: relative;
  overflow: hidden;
  height: 100%;
  color: #bbb;
  font-size: 12px;
}
.left,
.right {
  position: relative;
  float: left;
  height: 100%;
  background-color: #414146;
  transition: all 0.3s;
  outline: 1px solid #252527;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.52), 0 0 6px rgba(0, 0, 0, 0.04);
}
.right {
  float: right;
}
.left {
  overflow: hidden;

  .btn {
    position: relative;
    float: right;
    height: 20px;
    padding-top: 1px;
    box-sizing: border-box;
    &:active {
      top: 1px;
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
    transition: all 0.5s;
  }
}
</style>

