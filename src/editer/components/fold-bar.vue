<template>
  <div class="fold-bar">
    <div class="title-bar" @click="togglePannel">
      <div class="btn">
        <i :class="{'icon-rotate': !contentHeight}" class="el-icon-caret-bottom icon"></i>
      </div>
      <div class="title">{{ title }}</div>
      <div class="custom-right">
        <slot name="custom-right"></slot>
      </div>
    </div>
    <div :style="{maxHeight: `${contentHeight}px`}" class="content">
      <div class="pad" ref="box">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from "../../bus";
export default {
  props: {
    title: {
      default: "标题",
      type: String
    }
  },
  data() {
    return {
      contentHeight: "auto",
      originalHeight: 0,
      showContent: true
    };
  },
  mounted() {
    this.$nextTick(this.reset);
    EventBus.$on("reset-fold-bar", this.reset); // 全部 foldbar 实例都能收到
  },
  methods: {
    togglePannel() {
      if (this.showContent) {
        // 关闭
        this.contentHeight = 0;
        this.showContent = false;
      } else {
        // 打开
        this.contentHeight = this.originalHeight;
        this.showContent = true;
      }
    },
    reset() {
      if (this.contentHeight === this.$refs.box.clientHeight) return;
      this.originalHeight = this.$refs.box.clientHeight || 0;
      this.contentHeight = this.$refs.box.clientHeight || 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.fold-bar {
  .title-bar {
    height: 20px;
    width: 100%;
    line-height: 20px;
    // border-bottom: 1px solid #313134;
    outline: 1px solid #313134;
    box-sizing: border-box;
    padding: 0 5px;
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
    // overflow: auto;
    overflow: hidden;
    transition: max-height 0.2s;
    .pad {
    }
  }
}
</style>

