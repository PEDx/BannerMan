<template>
  <div class="sxp">
    <div ref="container" class="sort-container">
      <div class="sort-container-wrap" ref="wrap">
        <sort-element
          v-for="(val, idx) in dataList"
          :element-mixin-index="idx"
          :key="val.name"
        >{{ val.name }}</sort-element>
      </div>
      <div
        class="placeholder"
        ref="placeholder"
        style="transform: translate3d(0,0,0);visibility: hidden;top: 0;"
      ></div>
    </div>

    <div class="btn" :draggable="true">开始插入</div>
  </div>
</template>
<script>
import sortElement from "./SortElement";
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

const MAX_NUMBER = Number.MAX_SAFE_INTEGER;
export default {
  components: {
    sortElement
  },
  provide() {
    return {
      manager: this.manager
    };
  },
  data() {
    this.container = null;
    this.ghostNode = null;
    this.ghostTranslate = null;
    this.sortingNode = null;
    this.sortIndex = -1;
    this.newIndex = -1;
    this.sortStatus = 0;
    this.dragStatus = 0;
    this.manager = new Manager();
    this.autoScrollInterval = null;
    return {
      dataList: [
        { name: "name_000" },
        { name: "name_001" },
        { name: "name_002" },
        { name: "name_003" },
        { name: "name_004" },
        { name: "name_005" },
        { name: "name_006" },
        { name: "name_007" },
        { name: "name_008" },
        { name: "name_009" },
        { name: "name_010" }
      ]
    };
  },
  mounted() {
    this.initEvent();
  },
  methods: {
    initEvent() {
      this.container = this.$refs.container;
      this.container.addEventListener("mousedown", this.handleStart);
      this.container.addEventListener("mouseup", this.handleEnd);
      document.addEventListener("mouseup", this.handleEnd);
      this.container.addEventListener("dragenter", this.handleDragenter);
      document.addEventListener("drop", this.handleDrop);
      document.addEventListener("dragover", throttle(this.handleDragover, 16));
      this.container.addEventListener("dragleave", this.handleDragleave);
      this.container.addEventListener("dragend", this.handleDragend);
    },
    cancelEvent(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
    },
    handleDragenter(e) {
      if (this.dragStatus === DRAG_STATUS.DRAG_START) return;
      this.dragStatus = DRAG_STATUS.DRAG_START;
      const placeholder = this.$refs.placeholder;
      this.placeholderGhostNode = clonePressGhogNodeNode(placeholder);
      this.sortingNode = this.placeholderGhostNode;
      this.sortIndex = 14;
      this.sortingNodeHeight = placeholder.offsetHeight;
      this.sortingNodeWidth = placeholder.offsetWidth;
      const offsetY = e.pageY - this.sortingNodeHeight * 1.5;
      placeholder.style.top = `${offsetY}px`;
      console.log(offsetY);
      const wrap = this.$refs.wrap;
      const boundingClientRect = placeholder.getBoundingClientRect();
      const containerBoundingRect = this.container.getBoundingClientRect();
      this.placeholderGhostNode.style.visibility = "";
      this.placeholderGhostNode.style.position = "fixed";
      this.placeholderGhostNode.style.top = `${boundingClientRect.top}px`;
      this.placeholderGhostNode.style.left = `${boundingClientRect.left}px`;
      this.placeholderGhostNode.style.width = `${this.sortingNodeWidth}px`;
      this.placeholderGhostNode.style.height = `${this.sortingNodeHeight}px`;
      this.placeholderGhostNode.style.outline = `1px dashed rgb(125, 0, 0)`;
      this.placeholderGhostNode.style.boxSizing = "border-box";
      wrap.style.paddingBottom = `${this.sortingNodeHeight}px`;
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
      this.pressStartEdgeOffse = getEdgeOffset(this.placeholderGhostNode);
      this.pressStartOffset = getOffset(e);
      console.log("handleDragenter");
      this.cancelEvent(e);
    },
    handleDragover(e) {
      if (this.dragStatus !== DRAG_STATUS.DRAG_START) return;
      const offset = getOffset(e);
      const translate = {
        y: offset.y - this.pressStartOffset.y
      };
      this.placeholderGhostNode.style.transform = `translate3d(0,${translate.y}px, 0)`;
      this.animateOtherNodes(translate);
      this.autoScroll(translate);
      this.cancelEvent(e);
    },
    autoDragScroll(translate) {},
    handleDrop(e) {
      if (this.dragStatus === DRAG_STATUS.DRAG_END) return;
      this.dragStatus = DRAG_STATUS.DRAG_END;
      const wrap = this.$refs.wrap;
      this.animateOtherNodes({
        y: 0
      });
      wrap.style.paddingBottom = `${0}px`;
      this.placeholderGhostNode.parentNode.removeChild(
        this.placeholderGhostNode
      );
      this.cleanUp();
      console.log("handleDrop");
    },

    handleStart(e) {
      console.log("handleStart");
      const node = closest(e.target, el => el.sortableInfo != null);
      if (node && node.sortableInfo) {
        this.handlePress(e);
        this.sortStatus = SORT_STATUS.SORT_START;
      }
    },
    handleEnd(e) {
      if (this.sortStatus !== SORT_STATUS.SORT_START) return;
      console.log("handleEnd");
      this.ghostNode.parentNode.removeChild(this.ghostNode);
      this.cleanUp();
      console.log(`this.newIndex-${this.newIndex}`);
      if (this.newIndex === MAX_NUMBER) {
        this.newIndex = this.sortIndex;
      }
      arrayMove(this.dataList, this.sortIndex, this.newIndex);
      e.stopImmediatePropagation();
      e.preventDefault();
    },
    cleanUp() {
      this.sortStatus = SORT_STATUS.SORT_END;

      this.sortingNode.style.visibility = "";
      this.sortingNode.style.opacity = "";

      window.removeEventListener("mousemove", this.handleSortMove);

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
      const node = e.target;
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
      // debugger;
      console.log(`this.sortIndex-${this.sortIndex}`);
      window.addEventListener("mousemove", this.handleSortMove, false);
      window.addEventListener("mouseup", this.handleSortEnd, false);
    },
    handleSortMove(e) {
      e.preventDefault();
      this.updateGhostPosition(e);
      this.animateOtherNodes(this.ghostTranslate);
      this.autoScroll(this.ghostTranslate);
    },
    handleSortEnd() {},
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
      this.newIndex = MAX_NUMBER;
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
        let { edgeOffset } = getEdgeOffset(node);

        if (!edgeOffset) {
          nodeList[i].edgeOffset = edgeOffset = getEdgeOffset(node);
        }
        // 上移
        if (
          sortingMoveY <= edgeOffset.top + node.offsetHeight / 2 &&
          this.sortIndex > i
        ) {
          offsetY = this.sortingNode.offsetHeight;
          if (i <= this.newIndex) {
            this.newIndex = i; // fix: 滚动容器会直接调到最小值或最大值
          }
        }
        // 下移
        if (
          sortingMoveY >= edgeOffset.top - node.offsetHeight / 2 &&
          this.sortIndex < i
        ) {
          offsetY = -this.sortingNode.offsetHeight;
          this.newIndex = i;
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

<style lang="scss" scoped>
.sort-container {
  position: relative;
  width: 600px;
  margin: 0 auto;
  height: 400px;
  overflow: auto;
  outline: 1px solid red;
  margin-top: 50px;
}
.btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  background-color: red;
  margin: 0 auto;
  margin-top: 40px;
}
.placeholder {
  position: absolute;
  top: 0px;
  height: 60px;
  width: 100%;
  background-color: aquamarine;
  z-index: 999;
}
</style>

