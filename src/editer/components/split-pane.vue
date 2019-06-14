<template>
  <div
    :class="classes"
    class="split-pane"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div :style="leftStyles" class="left top">
      <slot name="left"/>
      <div class="dragger" @mousedown.prevent="dragStart"/>
    </div>
    <div :style="rightStyles" class="right bottom">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
import { clamp } from "../../utils/index";
const MIN_BASE_PIX = 20; // 为最小拖拉和关闭后的高度像素值
export default {
  props: {
    SplitPercent: {
      default: 70,
      type: Number
    },
    SplitStatus: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      split: this.SplitPercent,
      dragSplit: this.SplitPercent,
      dragging: false,
      view: "horizontal",
      itemStatus: this.SplitStatus,
      minSplit: 0
    };
  },
  provide() {
    return {
      splitPane: this
    };
  },
  computed: {
    leftStyles() {
      const obj = {
        height: `${this.split}%`
      };
      return obj;
    },

    rightStyles() {
      const obj = {
        height: `${100 - this.split}%`
      };
      return obj;
    },

    classes() {
      return [{ dragging: this.dragging }, this.view];
    }
  },
  mounted() {
    setTimeout(() => {
      this.minSplit = (MIN_BASE_PIX / this.$el.clientHeight) * 100;
      this.maxSplit = 100 - this.minSplit;
      Object.keys(this.itemStatus).forEach(key => {
        const val = this.itemStatus[key];
        this.rollUp(key, val);
      });
    }, 0);
  },
  methods: {
    rollUp(pos, show) {
      if (!show) {
        this.split = +clamp(
          pos === "top" ? 0 : 100,
          this.minSplit,
          this.maxSplit
        ).toFixed(2);
      } else {
        this.split = this.dragSplit;
      }
      this.itemStatus[pos] = show;
      this.$emit("split-change", {
        split: this.dragSplit,
        status: this.itemStatus
      });
    },
    dragStart(e) {
      const { top, bottom } = this.itemStatus;
      if (!top || !bottom) return; // 如果有 pane 关闭不能拖拉
      this.dragging = true;
      this.startPosition = e.pageY;
      this.startSplit = this.split;
    },

    dragMove(e) {
      if (this.dragging) {
        const position = e.pageY;
        const totalSize = this.$el.offsetHeight;
        const dPosition = position - this.startPosition;
        const _split = this.startSplit + ~~((dPosition / totalSize) * 100);
        this.split = +clamp(_split, this.minSplit, this.maxSplit).toFixed(2);
        this.dragSplit = this.split;
      }
    },

    dragEnd() {
      if (this.dragging) {
        this.$emit("split-change", {
          split: this.dragSplit,
          status: this.itemStatus
        });
      }
      this.dragging = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./tree/color.scss";
.split-pane {
  display: flex;
  height: 100%;
  &.horizontal {
    flex-direction: column;
  }

  &.dragging {
    .left,
    .right {
      pointer-events: none;
    }

    &.vertical {
      cursor: ew-resize;
    }

    &.horizontal {
      cursor: ns-resize;
    }
  }
}

.left,
.right {
  position: relative;
  height: 100%;
  // transition: height 0.15s;
}

.horizontal {
  .bottom {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    border-top: 1px solid $border-color;

    .vue-ui-dark-mode & {
      border-top: 1px solid $dark-border-color;
    }
  }
}

.vertical {
  .left {
    border-right: 1px solid $border-color;

    .vue-ui-dark-mode & {
      border-right: 1px solid $dark-border-color;
    }
  }
}

.dragger {
  position: absolute;
  z-index: 99;

  .vertical & {
    top: 0;
    bottom: 0;
    right: -5px;
    width: 10px;
    cursor: ew-resize;
  }

  .horizontal & {
    left: 0;
    right: 0;
    bottom: -5px;
    height: 10px;
    cursor: ns-resize;
  }
}
</style>

