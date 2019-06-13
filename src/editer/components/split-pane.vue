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
export default {
  props: {
    SplitPercent: {
      default: 70,
      type: Number
    }
  },
  data() {
    return {
      split: this.SplitPercent,
      dragging: false,
      view: "horizontal",
      itemStatus: { top: true, bottom: true }
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
        [this.view === "vertical" ? "width" : "height"]: `${this.boundSplit}%`
      };
      return obj;
    },

    rightStyles() {
      const obj = {
        [this.view === "vertical" ? "width" : "height"]: `${100 -
          this.boundSplit}%`
      };
      return obj;
    },

    classes() {
      return [{ dragging: this.dragging }, this.view];
    },

    boundSplit() {
      return this.split;
    }
  },

  methods: {
    rollUp(pos, pix, show) {
      this.$el.style.transition = "height 0.15s";
      if (pos === "top") {
        this.split = (pix / this.$el.clientHeight) * 100;
        this.itemStatus.top = show;
      }
      if (pos === "bottom") {
        this.split = 100 - (pix / this.$el.clientHeight) * 100;
        this.itemStatus.bottom = show;
      }
    },
    dragStart(e) {
      this.dragging = true;
      this.startPosition = this.view === "vertical" ? e.pageX : e.pageY;
      this.startSplit = this.boundSplit;
    },

    dragMove(e) {
      if (this.dragging) {
        let position;
        let totalSize;
        if (this.view === "vertical") {
          position = e.pageX;
          totalSize = this.$el.offsetWidth;
        } else {
          position = e.pageY;
          totalSize = this.$el.offsetHeight;
        }
        const dPosition = position - this.startPosition;
        this.split = this.startSplit + ~~((dPosition / totalSize) * 100);
      }
    },

    dragEnd() {
      this.dragging = false;
      this.$emit("split-change", this.split);
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

