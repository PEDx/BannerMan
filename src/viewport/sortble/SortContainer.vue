<template>
  <div
    class="sort-container"
    :style="{
      height: BmSortContainerHeight,
      position: 'relative',
      overflow: 'hidden'
    }"
  >
    <div
      class="sort-container-mark"
      v-if="BmSortContainerHandle"
      :style="{
        display: 'none',
        height: '20px',
        width: '20px',
        borderRadius: '0 0 0 50%',
        textAlign: 'center',
        position: 'absolute',
        backgroundColor: '#ff5500',
        top: 0,
        right: 0,
        color: '#fff',
        zIndex: 999
      }"
    >
      <svg
        t="1570520872415"
        style="fill: #fff;"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3241"
        width="14"
        height="14"
      >
        <path
          d="M674.005333 0q41.685333 0 80 15.658667 40.021333 16 70.656 46.677333 31.018667 31.317333 46.677333 70.314667 15.317333 37.674667 15.317333 80t-15.317333 80q-15.658667 38.997333-46.677333 70.314667l-392.661333 392.661333q-18.005333 18.005333-42.666667 28.330667-24.021333 9.344-48 9.344t-48-9.344q-24.661333-10.325333-42.666667-28.330667-18.688-18.688-27.989333-42.325333-9.344-22.656-9.344-48 0-25.685333 9.344-48.341333 9.344-23.338667 27.989333-42.325333l362.325333-361.984q12.672-12.672 30.336-12.672 17.322667 0 29.994667 12.672t12.672 29.994667q0 17.664-12.672 30.336l-362.325333 361.984q-12.330667 12.330667-12.330667 30.336 0 17.664 12.330667 29.994667 13.312 12.672 30.336 12.672t30.336-12.672l392.661333-392.661333q36.992-36.992 36.992-89.984t-36.992-89.984q-38.016-37.333333-90.325333-37.333333-52.650667 0-89.984 37.333333l-393.685333 391.68q-30.677333 30.677333-46.677333 70.656-15.658667 38.314667-15.658667 80.341333 0 41.344 15.658667 80.341333 16 39.68 46.677333 70.314667 31.658667 31.317333 70.656 47.018667t80.341333 15.658667 80.341333-15.658667 70.656-47.018667l391.978667-392.021333q12.672-12.672 30.336-12.672 17.322667 0 29.994667 12.672t12.672 29.994667q0 17.664-12.672 30.336l-392.021333 392.021333q-43.008 43.008-98.986667 65.664-53.333333 22.016-112.341333 22.016-58.666667 0-112.341333-22.016-56.021333-22.656-98.986667-65.664-42.666667-42.666667-65.322667-98.688-22.016-54.016-22.016-112.341333 0-58.666667 22.016-112.341333 22.314667-55.338667 65.322667-98.986667l0.341333 0 393.344-391.68q30.677333-30.677333 70.314667-46.677333 38.997333-15.658667 80-15.658667z"
          p-id="3375"
        />
      </svg>
    </div>
    <div
      class="sort-container-wrap"
      ref="container"
      :style="{
        position: 'relative',
        height: '100%',
        overflow: 'auto'
      }"
    >
      <div class="sort-container-scroll-container" ref="wrap">
        <slot />
      </div>
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
        line-height: 76px;
        color: #bbb2a8;
        font-size: 34px;
        text-align: center;
        box-sizing: border-box;
        background-color: rgba(166, 160, 183, 0.16);"
    >+</div>
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
const DISTANCE = 6;
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
    BmSortContainerHandle: {
      type: Boolean,
      default: false
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
    this.cancelDrag = false;
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
      (_e =>
        setTimeout(() => {
          this.$emit("drag-start", this);
          this.handleDragenter(_e);
        }))(e);
    },
    triggerDragEnd() {
      this.handleDragleave();
      this.dragStatus = DRAG_STATUS.DRAG_END;
      // console.log("triggerDragEnd");
    },
    handleDropEnd(e) {
      // console.log("handleDropEnd");
      if (this.newSortIndex === MAX_NUMBER) {
        this.newSortIndex = this.sortIndex;
      }
      this.handleDragleave();
      this.$emit("insert-end", this.newSortIndex);
      this.cancelEvent(e);
    },
    handleDragenter(e) {
      if (this.cancelDrag) {
        this.dragStatus = DRAG_STATUS.DRAG_END
        return;
      }
      this.cancelEvent(e);
      this.$emit("insert-start", e);
      const placeholder = this.$refs.placeholder;
      this.placeholderGhostNode = clonePressGhogNodeNode(placeholder);
      this.sortingNode = this.placeholderGhostNode;
      this.sortIndex = this.BmSortContainerData.length;
      this.sortingNodeHeight = placeholder.offsetHeight;
      this.sortingNodeWidth = placeholder.offsetWidth;
      const offsetY = e.layerY - this.sortingNodeHeight / 2;

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
      this.container.addEventListener("dragover", this.handleDragover, false);
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
    handleDragleave() {
      if (this.dragStatus !== DRAG_STATUS.DRAG_START) return;
      this.dragStatus = DRAG_STATUS.DRAG_END;
      const wrap = this.$refs.wrap;
      const placeholder = this.$refs.placeholder;
      wrap.style.paddingBottom = `${0}px`;
      placeholder.style.top = `${0}px`;
      if (this.placeholderGhostNode && this.placeholderGhostNode.parentNode) {
        this.placeholderGhostNode.parentNode.removeChild(
          this.placeholderGhostNode
        );
      }
      this.cleanUp();
      // console.log("handleDragleave");
    },
    nodeIsChild(node) {
      return node.sortableInfo.manager === this.manager;
    },
    handleStart(e) {
      // console.log("handleStart");
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
      // console.log("handleEnd");
    },
    handleSortEnd(e) {
      // console.log("handleSortEnd");
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

      this.container.removeEventListener("dragover", this.handleDragover);
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
      // console.log("handlePress");
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
      // console.log(nodeList);
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
        node.style.transitionDuration = `.2s`;
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

