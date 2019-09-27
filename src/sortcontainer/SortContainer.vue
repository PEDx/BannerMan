<template>
  <div
    ref="container"
    class="sort-container"
    :style="{
      height: BmSortContainerHeight,
      position: 'relative',
      overflow: 'auto'
    }"
  >
    <div class="sort-container-wrap" ref="wrap">
      <slot />
    </div>
    <div
      class="sort-container-placeholder"
      ref="placeholder"
      style="
        transform: translate3d(0,0,0);
        position: absolute;
        top: 0;
        visibility: hidden;
        width: 100%;
        height: 80px;
        line-height: 80px;
        text-align: center;
        box-sizing: border-box;
        background-color: rgba(166, 160, 183, 0.16);"
    >
      <i class="el-icon-plus" style="color: #bbb2a8;font-size: 34px;"></i>
    </div>
  </div>
</template>
<script>
import Manager from "./Manager";
import {
  getElementMargin,
  arrayMove,
  clonePressGhogNodeNode,
  getEdgeOffset,
  closest,
  limit,
  getOffset
} from "./utils";
import { throttle } from "@utils/index";
const SORT_STATUS = {
  SORT_START: 1,
  SORT_MOVE: 2,
  SORT_END: 3
};
const DRAG_STATUS = {
  DRAG_START: 1,
  DRAG_MOVE: 2,
  DRAG_END: 3
};
const DISTANCE = 8;
const MAX_NUMBER = Number.MAX_SAFE_INTEGER;
export default {
  provide() {
    return {
      manager: this.manager
    };
  },
  props: {
    BmSortContainerData: {
      type: Array,
      default: () => []
    },
    BmSortContainerHeight: {
      type: String,
      default: "100%"
    }
  },
  data() {
    this.container = null;
    this.ghostNode = null;
    this.ghostTranslate = null;
    this.sortingNode = null;
    this.sortIndex = -1;
    this.newSortIndex = -1;
    this.sortStatus = 0;
    this.dragStatus = 0;
    this.startPosY = 0;
    this.mouseStart = false;
    this.manager = new Manager();
    this.autoScrollInterval = null;
    return {};
  },
  mounted() {
    this.initEvent();
    this.dragMove = throttle(this._dragMove, 16);
  },
  methods: {
    initEvent() {
      this.container = this.$refs.container;
      this.container.addEventListener("mousedown", this.handleStart);
      this.container.addEventListener("mousemove", this.handleMove);
      this.container.addEventListener("mouseup", this.handleEnd);
      this.container.addEventListener("dragenter", this.handleDragStart);
      this.container.addEventListener("dragover", this.handleDragOver);
      // this.container.addEventListener("dragleave", this.handleDragEnd, false);
    },
    cancelEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    handleDragStart(e) {
      this.cancelEvent(e);
      if (this.dragStatus === DRAG_STATUS.DRAG_START) return;
      this.dragStatus = DRAG_STATUS.DRAG_START;
      this.handleDragenter(e);
      this.$emit("insert-start", e);
      console.log("handleDragStart");
    },
    handleDragOver(e) {},
    handleDrag(e) {},
    triggerDragEnd() {
      this.handleDragend();
      this.dragStatus = DRAG_STATUS.DRAG_END;
      console.log("triggerDragEnd");
    },
    handleDropEnd(e) {
      console.log("handleDropEnd");
      this.cancelEvent(e);
    },
    handleDragenter(e) {
      console.log("handleDragenter");
      this.dragStatus = DRAG_STATUS.DRAG_START;
      const placeholder = this.$refs.placeholder;
      this.placeholderGhostNode = clonePressGhogNodeNode(placeholder);
      this.sortingNode = this.placeholderGhostNode;
      this.sortIndex = this.BmSortContainerData.length;
      this.sortingNodeHeight = placeholder.offsetHeight;
      this.sortingNodeWidth = placeholder.offsetWidth;
      const offsetY =
        e.layerY - this.sortingNodeHeight / 2 + this.container.scrollTop;

      placeholder.style.top = `${offsetY}px`;

      const wrap = this.$refs.wrap;
      wrap.style.paddingBottom = `${this.sortingNodeHeight}px`;
      const boundingClientRect = placeholder.getBoundingClientRect();
      const containerBoundingRect = this.container.getBoundingClientRect();
      // console.log(containerBoundingRect);
      this.placeholderGhostNode.style.visibility = "";
      this.placeholderGhostNode.style.position = "fixed";
      this.placeholderGhostNode.style.top = `${boundingClientRect.top}px`;
      this.placeholderGhostNode.style.left = `${boundingClientRect.left}px`;
      this.placeholderGhostNode.style.width = `${this.sortingNodeWidth}px`;
      this.placeholderGhostNode.style.height = `${this.sortingNodeHeight}px`;
      this.placeholderGhostNode.style.outline = `1px dashed rgb(125, 0, 0)`;
      this.placeholderGhostNode.style.boxSizing = "border-box";
      this.placeholderGhostNode.style.willChange = "transform";
      this.placeholderGhostNode.style.pointerEvents = "none";
      // 开始拖拽初始的容器滚动了多少
      this.pressStartScroll = {
        top: this.container.scrollTop,
        left: this.container.scrollLeft
      };

      // 最多向下移动
      this.maxTranslateY =
        containerBoundingRect.top +
        containerBoundingRect.height -
        boundingClientRect.top -
        this.sortingNodeHeight / 2;

      // 最多向上移动
      this.minTranslateY =
        containerBoundingRect.top -
        boundingClientRect.top -
        this.sortingNodeHeight / 2;

      // 开始拖拽元素初始距离容器上边的距离
      this.pressStartEdgeOffse = getEdgeOffset(placeholder);
      this.pressStartOffset = getOffset(e);
      this.$emit("insert-start", e);
      this.container.removeEventListener("dragenter", this.handleDragenter);
      window.addEventListener("dragover", this.handleDragover, false);
      return this.cancelEvent(e);
    },
    handleDragover(e) {
      this.dragMove(e);
      this.cancelEvent(e);
    },
    _dragMove(e) {
      if (this.dragStatus !== DRAG_STATUS.DRAG_START) return;
      const offset = getOffset(e);
      const translate = {
        y: offset.y - this.pressStartOffset.y
      };
      // console.log(translate);
      translate.y = limit(this.minTranslateY, this.maxTranslateY, translate.y);
      this.placeholderGhostNode.style.transform = `translate3d(0,${translate.y}px, 0)`;
      this.animateOtherNodes(translate);
      this.autoScroll(translate);
    },
    handleDragend() {
      if (this.dragStatus !== DRAG_STATUS.DRAG_START) return;
      this.dragStatus = DRAG_STATUS.DRAG_END;
      const wrap = this.$refs.wrap;
      const placeholder = this.$refs.placeholder;
      wrap.style.paddingBottom = `${0}px`;
      placeholder.style.top = `${0}px`;
      this.placeholderGhostNode.parentNode.removeChild(
        this.placeholderGhostNode
      );
      this.cleanUp();
      this.$emit("insert-end", this.newSortIndex);
      console.log("handleDragend");
      console.log(this.newSortIndex);
    },
    nodeIsChild(node) {
      return node.sortableInfo.manager === this.manager;
    },
    handleStart(e) {
      console.log("handleStart");
      const node = closest(e.target, el => el.sortableInfo != null);
      if (node && node.sortableInfo && this.nodeIsChild(node)) {
        this.mouseStart = true;
        this.startPos = { y: e.pageY, x: e.pageX };
      }
    },
    handleMove(e) {
      if (this.sortStatus === SORT_STATUS.SORT_START || !this.mouseStart) {
        return;
      }
      const _delta = {
        y: this.startPos.y - e.pageY,
        x: this.startPos.x - e.pageX
      };
      const delta = Math.abs(_delta.x) + Math.abs(_delta.y);
      if (delta >= DISTANCE) {
        this.handlePress(e);
      }
    },
    handleEnd(e) {
      this.mouseStart = false;
      console.log("handleEnd");
    },
    handleSortEnd(e) {
      console.log("handleSortEnd");
      if (this.sortStatus !== SORT_STATUS.SORT_START) return;
      this.mouseStart = false;
      this.cleanUp();
      this.ghostNode.parentNode.removeChild(this.ghostNode);
      if (this.newSortIndex === MAX_NUMBER) {
        this.newSortIndex = this.sortIndex;
      }
      this.$emit("sort-end", {
        old: this.sortIndex,
        new: this.newSortIndex,
        id: this.BmSortContainerData[this.sortIndex].id
      });
      arrayMove(this.BmSortContainerData, this.sortIndex, this.newSortIndex);
      this.cancelEvent(e);
    },
    cleanUp() {
      this.sortStatus = SORT_STATUS.SORT_END;

      this.sortingNode.style.visibility = "";
      this.sortingNode.style.opacity = "";

      window.removeEventListener("dragover", this.handleDragover);
      window.removeEventListener("mousemove", this.handleSortMove);
      window.removeEventListener("mouseup", this.handleSortEnd);

      this.manager.getRefs().forEach((val, idx) => {
        val.node.style.transitionDuration = "";
        val.node.style.transform = "";
        val.edgeOffset = null;
      });

      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    },
    // 选中的移动的元素
    handlePress(e) {
      console.log("handlePress");
      this.sortStatus = SORT_STATUS.SORT_START;
      const node = closest(e.target, el => el.sortableInfo != null);
      const margin = getElementMargin(node);
      const boundingClientRect = node.getBoundingClientRect();
      const containerBoundingRect = this.container.getBoundingClientRect();
      this.sortingNode = node;
      this.sortingNodeWidth = node.offsetWidth;
      this.sortingNodeHeight = node.offsetHeight;
      // 创建 ghost
      this.ghostNode = clonePressGhogNodeNode(node);
      this.ghostNode.style.position = "fixed";
      this.ghostNode.style.top = `${boundingClientRect.top - margin.top}px`;
      this.ghostNode.style.left = `${boundingClientRect.left - margin.left}px`;
      this.ghostNode.style.width = `${this.sortingNodeWidth}px`;
      this.ghostNode.style.height = `${this.sortingNodeHeight}px`;
      this.ghostNode.style.outline = `1px dashed rgb(125, 0, 0)`;
      this.ghostNode.style.boxSizing = "border-box";
      this.ghostNode.style.pointerEvents = "none";

      // 隐藏原 node
      this.sortingNode.style.visibility = "hidden";
      this.sortingNode.style.opacity = 0;

      this.pressStartOffset = getOffset(e);
      // 开始拖拽初始的容器滚动了多少
      this.pressStartScroll = {
        top: this.container.scrollTop,
        left: this.container.scrollLeft
      };
      // 开始拖拽元素初始距离容器上边的距离
      this.pressStartEdgeOffse = getEdgeOffset(node);

      // 最多向下移动
      this.maxTranslateY =
        containerBoundingRect.top +
        containerBoundingRect.height -
        boundingClientRect.top -
        node.offsetHeight / 2;

      // 最多向上移动
      this.minTranslateY =
        containerBoundingRect.top -
        boundingClientRect.top -
        node.offsetHeight / 2;
      this.sortIndex = node.sortableInfo.index;

      this.newSortIndex = MAX_NUMBER;
      this.$emit("sort-start", e);
      window.addEventListener("mousemove", this.handleSortMove, false);
      window.addEventListener("mouseup", this.handleSortEnd);
    },
    handleSortMove(e) {
      this.updateGhostPosition(e);
      this.animateOtherNodes(this.ghostTranslate);
      this.autoScroll(this.ghostTranslate);
      this.cancelEvent(e);
    },
    updateGhostPosition(e) {
      const offset = getOffset(e);
      const translate = {
        y: offset.y - this.pressStartOffset.y
      };
      // 不能超过容器上下边缘
      translate.y = limit(this.minTranslateY, this.maxTranslateY, translate.y);
      // 在 Y 方向上拖拽了多少单位
      this.ghostTranslate = translate;
      this.ghostNode.style.transform = `translate3d(0,${translate.y}px, 0)`;
    },
    animateOtherNodes(translate) {
      // debugger;
      this.newSortIndex = MAX_NUMBER;
      const nodeList = this.manager.getOrderedRefs();
      // 在拖拽移动中滚动了的差值
      const deltaScroll = {
        left: this.container.scrollLeft - this.pressStartScroll.left,
        top: this.container.scrollTop - this.pressStartScroll.top
      };
      const sortingMoveY =
        translate.y + this.pressStartEdgeOffse.top + deltaScroll.top;
      for (let i = 0, len = nodeList.length; i < len; i++) {
        const { node } = nodeList[i];

        if (i === this.sortIndex) continue;
        let offsetY = 0;
        let { edgeOffset } = nodeList[i];

        if (!edgeOffset) {
          nodeList[i].edgeOffset = edgeOffset = getEdgeOffset(node);
        }
        const nextNode = i < nodeList.length - 1 && nodeList[i + 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = getEdgeOffset(nextNode.node);
        }
        // 上移
        if (
          sortingMoveY <= edgeOffset.top + node.offsetHeight / 2 &&
          this.sortIndex > i
        ) {
          offsetY = this.sortingNode.offsetHeight;
          if (i <= this.newSortIndex) {
            this.newSortIndex = i;
          }
        }
        // 下移
        if (
          sortingMoveY >=
            edgeOffset.top + node.offsetHeight / 2 - this.sortingNodeHeight &&
          this.sortIndex < i
        ) {
          offsetY = -this.sortingNode.offsetHeight;
          this.newSortIndex = i;
        }
        // node.style.transitionDuration = `.2s`;
        node.style.transform = `translate3d(0,${offsetY}px, 0)`;
      }
    },
    autoScroll(translate) {
      const translateY = translate.y;
      const direction = {
        x: 0,
        y: 0
      };
      const speed = {
        x: 1,
        y: 1
      };
      const acceleration = {
        x: 10,
        y: 10
      };
      if (translateY <= this.minTranslateY) {
        direction.y = -1; // Scroll Up
        speed.y =
          acceleration.y *
          Math.abs(
            (translateY - this.sortingNodeHeight / 2 - this.minTranslateY) /
              this.sortingNodeHeight
          );
      }
      if (translateY >= this.maxTranslateY) {
        direction.y = 1; // Scroll Down
        speed.y =
          acceleration.y *
          Math.abs(
            (this.maxTranslateY - this.sortingNodeHeight / 2 - translateY) /
              this.sortingNodeHeight
          );
      }

      if (this.autoScrollInterval) {
        clearInterval(this.autoScrollInterval);
        this.autoScrollInterval = null;
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.autoScrollInterval = setInterval(() => {
          this.isAutoScrolling = true;
          const offset = {
            left: 1 * speed.x * direction.x,
            top: 1 * speed.y * direction.y
          };
          this.container.scrollTop += offset.top;
          this.animateOtherNodes(translate);
        }, 15);
      }
    }
  }
};
</script>

