<template>
  <div class="fold-bar">
    <scroll-pane>
      <div class="title-bar" @click="togglePannel" slot="header">
        <div class="btn">
          <i :class="{'icon-rotate': !showContent}" class="el-icon-caret-bottom icon"></i>
        </div>
        <div class="title">{{ title }}</div>
        <div class="custom-right">
          <slot name="custom-right"></slot>
        </div>
      </div>
      <div class="content" slot="scroll">
        <slot></slot>
      </div>
    </scroll-pane>
  </div>
</template>
<script>
import ScrollPane from "./scroll-pane";
export default {
  components: {
    ScrollPane
  },
  props: {
    title: {
      default: "标题",
      type: String
    },
    pos: {
      default: "top",
      type: String
    }
  },
  data() {
    return {
      showContent: this.splitPane.itemStatus[this.pos],
      split: "100%"
    };
  },
  inject: ["splitPane"],
  mounted() {},
  methods: {
    togglePannel() {
      const { top, bottom } = this.splitPane.itemStatus;
      // 不能全部关闭 pane
      if (!top && this.showContent && this.pos === "bottom") return;
      if (!bottom && this.showContent && this.pos === "top") return;
      this.showContent = !this.showContent;
      this.splitPane.rollUp(this.pos, this.showContent);
    }
  }
};
</script>

<style lang="scss" scoped>
.fold-bar {
  height: 100%;
  .title-bar {
    height: 20px;
    width: 100%;
    line-height: 20px;
    // border-bottom: 1px solid #313134;
    outline: 1px solid #313134;
    box-sizing: border-box;
    // padding: 0 5px;
    overflow: hidden;
    cursor: pointer;
    .title {
      float: left;
      user-select: none;
    }
    .custom-right {
      float: right;
      height: 20px;
      line-height: 20px;
    }

    .btn {
      position: relative;
      float: left;
      padding-right: 4px;
      padding-left: 5px;
      .icon {
        transition: all 0.2s;
        transform: rotate(0deg);
      }
      .icon-rotate {
        transition: all 0.2s;
        transform: rotate(180deg);
      }
      &:active {
        // top: 1px;
      }
    }
  }
  .content {
    // height: 100%;
    // transition: height 0.2s;
    overflow: hidden;
    .pad {
    }
  }
}
</style>

