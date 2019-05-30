<template>
  <div class="fold-bar">
    <div class="title-bar" @click="togglePannel">
      <div class="btn">
        <i :class="{'icon-rotate': !contentHeight}" class="el-icon-caret-bottom icon"></i>
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <div ref="content" :style="{maxHeight: `${contentHeight}px`}" class="content">
      <div class="pad">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
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
      originalHeight: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.originalHeight = this.$refs.content.clientHeight;
      this.contentHeight = this.$refs.content.clientHeight;
    });
  },
  methods: {
    togglePannel() {
      this.contentHeight = this.contentHeight ? 0 : this.originalHeight;
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
    overflow: auto;
    // overflow: hidden;
    transition: max-height 0.2s;
    .pad {
      padding: 8px;
    }
  }
}
</style>

