<template>
  <transition name="scale">
    <vue-draggable-resizable
      class="draggable-resizable"
      :resizable="resizable"
      :drag-handle="'.draggable-resizable-handle'"
      @dragging="onDrag"
      @resizing="onResize"
      class-name-handle="handle"
      @activated="onActivated"
      @deactivated="onDeactivated"
      @dragstop="onDragStop"
      :w="size.width"
      :min-width="size.minWidth || 100"
      :min-height="size.minHeight || 100"
      :h="size.height"
      :x="position.x "
      :y="position.y"
      v-show="show"
    >
      <div class="title-bar draggable-resizable-handle">
        <span class="title">{{ title }}</span>
        <span class="custom-right">
          <el-button type="text" class="btn" icon="el-icon-crop" @click.stop="handleResizable"></el-button>
          <el-button type="text" class="btn" icon="el-icon-minus" @click.stop="handleMinimize"></el-button>
          <el-button type="text" class="btn" icon="el-icon-close" @click.stop="handleClose"></el-button>
        </span>
      </div>
      <div class="content">
        <div class="box">
          <slot />
        </div>
      </div>
    </vue-draggable-resizable>
  </transition>
</template>
<script>
export default {
  props: {
    title: {
      default: "浮动窗体",
      type: String
    },
    show: {
      default: false,
      type: Boolean
    },
    size: {
      default: () => ({ width: 300, height: 500 }),
      type: Object
    },
    position: {
      default: () => ({ x: 0, y: 0 }),
      type: Object
    }
  },
  data() {
    return {
      resizable: false
    };
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  methods: {
    onResize(x, y, width, height) {},
    onDrag(x, y) {},
    onDragStop(x, y) {
      // console.log(x, y);
    },
    onActivated() {},
    onDeactivated() {
      this.resizable = false;
    },
    handleClose(x, y) {
      this.$emit("update:show", false);
    },
    handleMinimize() {},
    handleResizable() {
      this.resizable = !this.resizable;
    }
  }
};
</script>
<style lang="scss">
.draggable-resizable .handle {
  background-color: #eee !important;
}
</style>

<style lang="scss" scoped>
.draggable-resizable {
  background-color: #414146;
  color: #eee;
  z-index: 999 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border: 1px solid #313134;
  .draggable-resizable-handle {
    cursor: move;
  }
  .title-bar {
    position: relative;
    height: 20px;
    width: 100%;
    line-height: 20px;
    font-size: 12px;
    background-color: #414146;
    border-bottom: 1px solid #313134;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 2;
    .title {
      float: left;
      user-select: none;
      margin-left: 4px;
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
    }
  }
  .content {
    position: relative;
    height: 100%;
    margin-top: -20px;
    padding-top: 20px;
    box-sizing: border-box;
    z-index: 1;
    .box {
      height: 100%;
    }
  }
}
</style>
