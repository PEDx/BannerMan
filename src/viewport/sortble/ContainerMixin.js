import Manager from './Manager';
import {
  closest,
  events,
  vendorPrefix,
  limit,
  getElementMargin,
  arrayMove
} from './utils';
import { throttle } from '../../utils/index';
const PLACEHOLDER_HEIGHT = 80;
// Export Sortable Container Component Mixin
export const ContainerMixin = {
  data() {
    return {
      sorting: false,
      sortingIndex: null,
      manager: new Manager(),
      events: {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd
      }
    };
  },

  props: {
    value: { type: Array, default: () => [] },
    axis: { type: String, default: 'y' }, // 'x', 'y', 'xy'
    distance: { type: Number, default: 0 },
    pressDelay: { type: Number, default: 0 },
    pressThreshold: { type: Number, default: 5 },
    useDragHandle: { type: Boolean, default: false },
    useWindowAsScrollContainer: { type: Boolean, default: false },
    hideSortableGhost: { type: Boolean, default: true },
    lockToContainerEdges: { type: Boolean, default: false },
    lockOffset: { type: [String, Number, Array], default: '50%' },
    transitionDuration: { type: Number, default: 300 },
    appendTo: { type: String, default: 'body' },
    draggedSettlingDuration: { type: Number, default: null },
    lockAxis: { type: String, default: 'y' },
    helperClass: String,
    contentWindow: Object,
    shouldCancelStart: {
      type: Function,
      default: e => {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        const disabledElements = [
          'input',
          'textarea',
          'select',
          'option',
          'button'
        ];
        return disabledElements.indexOf(e.target.tagName.toLowerCase()) !== -1;
      }
    },
    getHelperDimensions: {
      type: Function,
      default: ({ node }) => ({
        width: node.offsetWidth,
        height: node.offsetHeight
      })
    }
  },

  provide() {
    return {
      manager: this.manager
    };
  },

  mounted() {
    this.container = this.$el;
    this.document = this.container.ownerDocument || document;
    this._window = this.contentWindow || window;
    this.scrollContainer = this.useWindowAsScrollContainer
      ? this.document.scrollingElement
      : this.container.parentNode;
    // debugger;
    for (const key in this.events) {
      if (this.events.hasOwnProperty(key)) {
        events[key].forEach(eventName =>
          this.container.addEventListener(
            eventName,
            throttle(e => {
              this.events[key](e);
              if (eventName === 'mouseup') return;
              // fix bug
              e.stopImmediatePropagation();
              e.preventDefault();
            }, 20),
            false
          )
        );
      }
    }
    this.exposeCustomApi();
  },

  beforeDestroy() {
    for (const key in this.events) {
      if (this.events.hasOwnProperty(key)) {
        events[key].forEach(eventName =>
          this.container.removeEventListener(eventName, this.events[key])
        );
      }
    }
  },

  methods: {
    handleStart(e) {
      const { distance, shouldCancelStart } = this.$props;

      if (e.button === 2 || shouldCancelStart(e)) {
        return false;
      }

      this._touched = true;
      this._pos = {
        x: e.pageX,
        y: e.pageY
      };

      const node = closest(e.target, el => el.sortableInfo != null);

      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.sorting
      ) {
        const { useDragHandle } = this.$props;
        const { index, collection } = node.sortableInfo;

        if (
          useDragHandle &&
          !closest(e.target, el => el.sortableHandle != null)
        ) {
          return;
        }

        this.manager.active = { index, collection };

        /*
         * Fixes a bug in Firefox where the :active state of anchor tags
         * prevent subsequent 'mousemove' events from being fired
         * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
         */
        if (e.target.tagName.toLowerCase() === 'a') {
          e.preventDefault();
        }
        if (!distance) {
          if (this.$props.pressDelay === 0) {
            this.handlePress(e);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(e),
              this.$props.pressDelay
            );
          }
        }
      }
    },

    nodeIsChild(node) {
      return node.sortableInfo.manager === this.manager;
    },

    handleMove(e) {
      const { distance, pressThreshold } = this.$props;

      if (!this.sorting && this._touched) {
        this._delta = {
          x: this._pos.x - e.pageX,
          y: this._pos.y - e.pageY
        };
        const delta = Math.abs(this._delta.x) + Math.abs(this._delta.y);

        if (
          !distance &&
          (!pressThreshold || (pressThreshold && delta >= pressThreshold))
        ) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (distance && delta >= distance && this.manager.isActive()) {
          this.handlePress(e);
        }
      }
    },

    handleEnd() {
      const { distance } = this.$props;

      this._touched = false;

      if (!distance) {
        this.cancel();
      }
    },

    cancel() {
      if (!this.sorting) {
        clearTimeout(this.pressTimer);
        this.manager.active = null;
      }
    },

    handlePress(e) {
      const active = this.manager.getActive();
      // debugger;
      if (active) {
        const {
          axis,
          getHelperDimensions,
          helperClass,
          hideSortableGhost,
          useWindowAsScrollContainer,
          appendTo
        } = this.$props;
        const { node, collection } = active;
        const { index, isPlaceholder } = node.sortableInfo;
        const margin = getElementMargin(node);

        const containerBoundingRect = this.container.getBoundingClientRect();
        const dimensions = getHelperDimensions({ index, node, collection });

        this.node = node;
        this.margin = margin;
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.marginOffset = {
          x: this.margin.left + this.margin.right,
          y: Math.max(this.margin.top, this.margin.bottom)
        };
        this.boundingClientRect = node.getBoundingClientRect();
        this.containerBoundingRect = containerBoundingRect;
        this.index = index;
        this.isPlaceholder = isPlaceholder;
        this.newIndex = index;

        this._axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0
        };
        this.offsetEdge = this.getEdgeOffset(node);
        this.initialOffset = this.getOffset(e) || {};
        // debugger
        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft
        };

        this.initialWindowScroll = {
          top: window.pageYOffset,
          left: window.pageXOffset
        };
        const fields = node.querySelectorAll('input, textarea, select');
        // 构造 ghost 虚拟的拖拽节点
        const clonedNode = node.cloneNode(true);
        const clonedFields = [
          ...clonedNode.querySelectorAll('input, textarea, select')
        ]; // Convert NodeList to Array

        clonedFields.forEach((field, index) => {
          if (field.type !== 'file' && fields[index]) {
            field.value = fields[index].value;
          }
        });

        this.helper = this.document
          .querySelector(appendTo)
          .appendChild(clonedNode);

        this.helper.style.position = 'fixed';
        this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
        this.helper.style.left = `${this.boundingClientRect.left -
          margin.left}px`;
        this.helper.style.width = `${this.width}px`;
        this.helper.style.height = `${this.height}px`;
        this.helper.style.outline = `1px dashed rgb(125, 125, 125)`;
        this.helper.style.boxSizing = 'border-box';
        this.helper.style.pointerEvents = 'none';

        // 是否隐藏 ghost 节点
        if (hideSortableGhost) {
          // debugger;
          this.sortableGhost = node;
          node.style.visibility = 'hidden';
          node.style.opacity = 0;
        }

        this.translate = {};
        this.minTranslate = {};
        this.maxTranslate = {};
        if (this._axis.x) {
          this.minTranslate.x =
            (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) -
            this.boundingClientRect.left -
            this.width / 2;
          this.maxTranslate.x =
            (useWindowAsScrollContainer
              ? this._window.innerWidth
              : containerBoundingRect.left + containerBoundingRect.width) -
            this.boundingClientRect.left -
            this.width / 2;
        }
        if (this._axis.y) {
          this.minTranslate.y =
            (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) -
            this.boundingClientRect.top -
            this.height / 2;
          this.maxTranslate.y =
            (useWindowAsScrollContainer
              ? window.innerHeight
              : containerBoundingRect.top + containerBoundingRect.height) -
            this.boundingClientRect.top -
            this.height / 2;
        }
        if (helperClass) {
          this.helper.classList.add(...helperClass.split(' '));
        }
        this.listenerNode = e.touches ? node : this._window;
        if (!this.isPlaceholder) {
          events.move.forEach(eventName =>
            this.listenerNode.addEventListener(
              eventName,
              this.handleSortMove,
              false
            )
          );
          events.end.forEach(eventName =>
            this.listenerNode.addEventListener(
              eventName,
              this.handleSortEnd,
              false
            )
          );
        }

        this.sorting = true;
        this.sortingIndex = index;

        this.$emit('sort-start', { event: e, node, index, collection });
      }
    },

    handleSortMove(e) {
      // 由鼠标移动触发
      e.preventDefault(); // Prevent scrolling on mobile

      // 随着拖拉更新 ghost 节点的位置
      this.updatePosition(e);
      // 更新 ghost 的同时, 更新列表中其他节点的位置
      this.animateNodes();
      this.autoscroll();
      this.$emit('sort-move', { event: e });
    },
    exposeCustomApi() {
      this.hackState = this._hackState;
      this.clearHackState = this._clearHackState;
      this.palceholderMove = throttle(this._palceholderMove, 16);
    },
    _hackState(e, collection) {
      console.log('hackState');
      this.manager.active = {
        collection: collection || 'default'
      };
      const offsetY = e.pageY;
      // debugger
      this.manager.active.index = this.manager.getOrderedRefs().length - 1;
      const placeholder = this.manager.getPlaceholder();
      placeholder.node.style.top = `${offsetY - PLACEHOLDER_HEIGHT / 2}px`;
      placeholder.node.style.display = `block`;
      this.$el.style.height = `${this.$el.clientHeight + PLACEHOLDER_HEIGHT}px`;
      this.handlePress(e);
    },
    _palceholderMove(e) {
      const offsetY = this.useWindowAsScrollContainer ? e.pageY : e.offsetY;
      this.mousePos = {
        scrollTop: offsetY,
        edgeTop: e.y
      };
      this.handleSortMove(e);
    },
    _clearHackState(e) {
      const placeholder = this.manager.getPlaceholder();
      placeholder.node.style.display = `none`;
      this.$el.style.height = `auto`;
      this.handleSortEnd(e, true);
    },

    getEdgeOffset(node, offset = { top: 0, left: 0 }) {
      // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested
      if (node) {
        const nodeOffset = {
          top: offset.top + node.offsetTop,
          left: offset.left + node.offsetLeft
        };
        // if (node.parentNode !== this.container) {
        //   return this.getEdgeOffset(node.parentNode, nodeOffset);
        // } else {
        //   return nodeOffset;
        // }
        return nodeOffset;
      }
    },

    getOffset(e) {
      return {
        x: e.touches ? e.touches[0].pageX : e.pageX,
        y: e.touches ? e.touches[0].pageY : e.pageY
      };
    },

    getLockPixelOffsets() {
      let { lockOffset } = this.$props;

      if (!Array.isArray(this.lockOffset)) {
        lockOffset = [lockOffset, lockOffset];
      }

      if (lockOffset.length !== 2) {
        throw new Error(
          `lockOffset prop of SortableContainer should be a single value or an array of exactly two values. Given ${lockOffset}`
        );
      }

      const [minLockOffset, maxLockOffset] = lockOffset;

      return [
        this.getLockPixelOffset(minLockOffset),
        this.getLockPixelOffset(maxLockOffset)
      ];
    },

    getLockPixelOffset(lockOffset) {
      let offsetX = lockOffset;
      let offsetY = lockOffset;
      let unit = 'px';

      if (typeof lockOffset === 'string') {
        const match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);

        if (match === null) {
          throw new Error(
            `lockOffset value should be a number or a string of a number followed by "px" or "%". Given ${lockOffset}`
          );
        }

        offsetX = offsetY = parseFloat(lockOffset);
        unit = match[1];
      }

      if (!isFinite(offsetX) || !isFinite(offsetY)) {
        throw new Error(
          `lockOffset value should be a finite. Given ${lockOffset}`
        );
      }

      if (unit === '%') {
        offsetX = (offsetX * this.width) / 100;
        offsetY = (offsetY * this.height) / 100;
      }

      return {
        x: offsetX,
        y: offsetY
      };
    },
    animateNodes() {
      const { transitionDuration, hideSortableGhost } = this.$props;
      const nodes = this.manager.getOrderedRefs(); // 拿到排序好的真实 dom
      if (!nodes) return;
      const deltaScroll = {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top
      };
      const sortingOffset = {
        left: this.offsetEdge.left + this.translate.x + deltaScroll.left,
        top: this.offsetEdge.top + this.translate.y + deltaScroll.top
      };
      // if (this.isPlaceholder) {
      //   sortingOffset.top = this.placeholderPos.top;
      // }
      const scrollDifference = {
        top: window.pageYOffset - this.initialWindowScroll.top,
        left: window.pageXOffset - this.initialWindowScroll.left
      };
      this.newIndex = null;

      // 在此计算每个元素是否应该移动,移动多少位置
      for (let i = 0, len = nodes.length; i < len; i++) {
        const { node } = nodes[i];
        const index = node.sortableInfo.index;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          width: this.width > width ? width / 2 : this.width / 2,
          height: this.height > height ? height / 2 : this.height / 2
        };
        const translate = {
          x: 0,
          y: 0
        };
        let { edgeOffset } = nodes[i];

        // If we haven't cached the node's offsetTop / offsetLeft value
        if (!edgeOffset) {
          nodes[i].edgeOffset = edgeOffset = this.getEdgeOffset(node);
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = this.getEdgeOffset(nextNode.node);
        }
        if (node.sortableInfo.isPlaceholder) {
          nodes[i].edgeOffset = edgeOffset = { ...prevNode.edgeOffset };
          edgeOffset.top += 2000;
          // debugger
        }
        // If the node is the one we're currently animating, skip it
        if (index === this.index) {
          if (hideSortableGhost) {
            // debugger;
            /*
             * With windowing libraries such as `react-virtualized`, the sortableGhost
             * node may change while scrolling down and then back up (or vice-versa),
             * so we need to update the reference to the new node just to be safe.
             */
            this.sortableGhost = node;
            node.style.visibility = 'hidden';
            node.style.opacity = 0;
          }
          continue;
        }

        if (transitionDuration) {
          node.style[
            `${vendorPrefix}TransitionDuration`
          ] = `${transitionDuration}ms`;
        }

        if (this._axis.x) {
          if (this._axis.y) {
            // Calculations for a grid setup
            if (
              index < this.index &&
              ((sortingOffset.left + scrollDifference.left - offset.width <=
                edgeOffset.left &&
                sortingOffset.top + scrollDifference.top <=
                  edgeOffset.top + offset.height) ||
                sortingOffset.top + scrollDifference.top + offset.height <=
                  edgeOffset.top)
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x = this.width + this.marginOffset.x;
              if (
                edgeOffset.left + translate.x >
                this.containerBoundingRect.width - offset.width
              ) {
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                translate.y = nextNode.edgeOffset.top - edgeOffset.top;
              }
              if (this.newIndex === null) {
                this.newIndex = index;
              }
            } else if (
              index > this.index &&
              ((sortingOffset.left + scrollDifference.left + offset.width >=
                edgeOffset.left &&
                sortingOffset.top + scrollDifference.top + offset.height >=
                  edgeOffset.top) ||
                sortingOffset.top + scrollDifference.top + offset.height >=
                  edgeOffset.top + height)
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(this.width + this.marginOffset.x);
              if (
                edgeOffset.left + translate.x <
                this.containerBoundingRect.left + offset.width
              ) {
                // If it moves passed the left bounds, then animate it to the last position of the previous row.
                // We just use the offset of the previous node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                translate.y = prevNode.edgeOffset.top - edgeOffset.top;
              }
              this.newIndex = index;
            }
          } else {
            if (
              index > this.index &&
              sortingOffset.left + scrollDifference.left + offset.width >=
                edgeOffset.left
            ) {
              translate.x = -(this.width + this.marginOffset.x);
              this.newIndex = index;
            } else if (
              index < this.index &&
              sortingOffset.left + scrollDifference.left <=
                edgeOffset.left + offset.width
            ) {
              translate.x = this.width + this.marginOffset.x;
              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
        } else if (this._axis.y) {
          // edgeOffset: {top: 240, left: 0} 变换移动元素距离上边距距离
          // height: 340 变换移动元素高度
          // offset: {width: 207, height: 120}
          // scrollDifference: {top: 0, left: 0} // 滚动的距离
          // sortingOffset: {left: 0, top: 78} 拖拉元素距离上边距距离
          // _height: 240 拖拉元素高度
          // this.throttleLog({
          //   deltaScroll,
          //   edgeOffset,
          //   sortingOffset,
          //   height
          // });
          if (
            index > this.index &&
            sortingOffset.top >= edgeOffset.top + height / 2 - this.height
          ) {
            // 超过下面临近元素的二分之一高度就移动
            // 向下拉
            translate.y = -(this.height + this.marginOffset.y);
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.top <= edgeOffset.top + height / 2
          ) {
            // 超过上面临近元素的二分之一高度就移动
            // 向上拉
            translate.y = this.height + this.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
            }
            // console.log('down');
          }
        }
        node.style[`${vendorPrefix}Transform`] = `translate3d(${
          translate.x
        }px,${translate.y}px,0)`;
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }
    },
    updatePosition(e) {
      const { lockAxis, lockToContainerEdges } = this.$props;

      const offset = this.getOffset(e);
      const translate = {
        x: offset.x - this.initialOffset.x,
        y: offset.y - this.initialOffset.y
      };
      // Adjust for window scroll
      translate.y -= window.pageYOffset - this.initialWindowScroll.top;
      translate.x -= window.pageXOffset - this.initialWindowScroll.left;

      this.translate = translate;

      if (lockToContainerEdges) {
        const [minLockOffset, maxLockOffset] = this.getLockPixelOffsets();
        const minOffset = {
          x: this.width / 2 - minLockOffset.x,
          y: this.height / 2 - minLockOffset.y
        };
        const maxOffset = {
          x: this.width / 2 - maxLockOffset.x,
          y: this.height / 2 - maxLockOffset.y
        };

        translate.x = limit(
          this.minTranslate.x + minOffset.x,
          this.maxTranslate.x - maxOffset.x,
          translate.x
        );
        translate.y = limit(
          this.minTranslate.y + minOffset.y,
          this.maxTranslate.y - maxOffset.y,
          translate.y
        );
      }

      if (lockAxis === 'x') {
        translate.y = 0;
      } else if (lockAxis === 'y') {
        translate.x = 0;
      }

      this.helper.style[`${vendorPrefix}Transform`] = `translate3d(${
        translate.x
      }px,${translate.y}px, 0)`;
    },

    throttleLog: throttle(arg => {
      console.log('>>>>>>>>');
      console.log(arg);
      console.log('<<<<<<<<');
    }, 207),
    autoscroll() {
      const translate = this.translate;
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
      if (translate.y >= this.maxTranslate.y - this.height / 2) {
        direction.y = 1; // Scroll Down
        speed.y =
          acceleration.y *
          Math.abs(
            (this.maxTranslate.y - this.height / 2 - translate.y) / this.height
          );
      } else if (translate.x >= this.maxTranslate.x - this.width / 2) {
        direction.x = 1; // Scroll Right
        speed.x =
          acceleration.x *
          Math.abs(
            (this.maxTranslate.x - this.width / 2 - translate.x) / this.width
          );
      } else if (translate.y <= this.minTranslate.y + this.height / 2) {
        direction.y = -1; // Scroll Up
        speed.y =
          acceleration.y *
          Math.abs(
            (translate.y - this.height / 2 - this.minTranslate.y) / this.height
          );
      } else if (translate.x <= this.minTranslate.x + this.width / 2) {
        direction.x = -1; // Scroll Left
        speed.x =
          acceleration.x *
          Math.abs(
            (translate.x - this.width / 2 - this.minTranslate.x) / this.width
          );
      }
      if (this.autoscrollInterval) {
        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = null;
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.autoscrollInterval = setInterval(() => {
          this.isAutoScrolling = true;
          const offset = {
            left: 1 * speed.x * direction.x,
            top: 1 * speed.y * direction.y
          };
          this.scrollContainer.scrollTop += offset.top;
          this.scrollContainer.scrollLeft += offset.left;
          this.translate.x += offset.left;
          this.translate.y += offset.top;
          this.animateNodes();
        }, 15);
      }
    },
    transitionHelperIntoPlace(nodes) {
      if (this.$props.draggedSettlingDuration === 0) {
        return Promise.resolve();
      }

      const deltaScroll = {
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top
      };
      const indexNode = nodes[this.index].node;
      const newIndexNode = nodes[this.newIndex].node;

      let targetX = -deltaScroll.left;
      if (this.translate && this.translate.x > 0) {
        // Diff against right edge when moving to the right
        targetX +=
          newIndexNode.offsetLeft +
          newIndexNode.offsetWidth -
          (indexNode.offsetLeft + indexNode.offsetWidth);
      } else {
        targetX += newIndexNode.offsetLeft - indexNode.offsetLeft;
      }

      let targetY = -deltaScroll.top;
      if (this.translate && this.translate.y > 0) {
        // Diff against the bottom edge when moving down
        targetY +=
          newIndexNode.offsetTop +
          newIndexNode.offsetHeight -
          (indexNode.offsetTop + indexNode.offsetHeight);
      } else {
        targetY += newIndexNode.offsetTop - indexNode.offsetTop;
      }

      const duration =
        this.$props.draggedSettlingDuration !== null
          ? this.$props.draggedSettlingDuration
          : this.$props.transitionDuration;

      this.helper.style[
        `${vendorPrefix}Transform`
      ] = `translate3d(${targetX}px,${targetY}px, 0)`;
      this.helper.style[`${vendorPrefix}TransitionDuration`] = `${duration}ms`;

      return new Promise(resolve => {
        // Register an event handler to clean up styles when the transition
        // finishes.
        const cleanup = event => {
          if (!event || event.propertyName === 'transform') {
            clearTimeout(cleanupTimer);
            this.helper.style[`${vendorPrefix}Transform`] = '';
            this.helper.style[`${vendorPrefix}TransitionDuration`] = '';
            resolve();
          }
        };
        // Force cleanup in case 'transitionend' never fires
        const cleanupTimer = setTimeout(cleanup, duration + 10);
        this.helper.addEventListener('transitionend', cleanup, false);
      });
    },
    handleSortEnd(e, immediate) {
      const { collection } = this.manager.active;

      // Remove the event listeners if the node is still in the DOM
      if (this.listenerNode) {
        events.move.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortMove)
        );
        events.end.forEach(eventName =>
          this.listenerNode.removeEventListener(eventName, this.handleSortEnd)
        );
      }

      const nodes = this.manager.refs[collection];

      const onEnd = () => {
        // Remove the helper from the DOM
        this.helper.parentNode.removeChild(this.helper);

        if (this.hideSortableGhost && this.sortableGhost) {
          this.sortableGhost.style.visibility = '';
          this.sortableGhost.style.opacity = '';
        }

        for (let i = 0, len = nodes.length; i < len; i++) {
          const node = nodes[i];
          const el = node.node;

          // Clear the cached offsetTop / offsetLeft value
          node.edgeOffset = null;

          // Remove the transforms / transitions
          el.style[`${vendorPrefix}Transform`] = '';
          el.style[`${vendorPrefix}TransitionDuration`] = '';
        }

        // Stop autoscroll
        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = null;

        // Update state
        this.manager.active = null;

        this.sorting = false;
        this.sortingIndex = null;

        this.$emit('sort-end', {
          event: e,
          oldIndex: this.index,
          newIndex: this.newIndex,
          collection,
          isPlaceholder: this.isPlaceholder
        });
        // console.log(this.index);
        // console.log(this.newIndex);
        // console.log(this.value);

        if (this.index !== this.newIndex) {
          this.$emit(
            'input',
            this.isPlaceholder
              ? this.value
              : arrayMove(this.value, this.index, this.newIndex)
          );
        }
        this._touched = false;
      };

      if (immediate) {
        onEnd();
        return;
      }

      if (
        this.$props.transitionDuration ||
        this.$props.draggedSettlingDuration
      ) {
        this.transitionHelperIntoPlace(nodes).then(() => onEnd());
      } else {
        onEnd();
      }
    }
  }
};
