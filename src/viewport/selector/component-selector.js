import EventBus from '@/bus';
import {
  highlight,
  unHighlight,
  highlightContainer,
  unHighlightContainer,
  highlightSelected
} from './highlighter';
import { findRelatedComponent } from '@utils/index';
const isBrowser = true;

export default class ComponentSelector {
  constructor(container) {
    const self = this;
    this.container = container || window;
    self.bindMethods();
  }

  /**
   * Adds event listeners for mouseover and mouseup
   */
  startSelecting() {
    if (!isBrowser) return;
    this.container.addEventListener('mouseover', this.elementMouseOver, true);
    this.container.addEventListener('click', this.elementClicked, true);
    this.container.addEventListener('mouseout', this.cancelEvent, true);
    this.container.addEventListener('mouseenter', this.cancelEvent, true);
    // window.addEventListener('mouseleave', this.cancelEvent, true);
    // window.addEventListener('mousedown', this.cancelEvent, true);
    // window.addEventListener('mouseup', this.cancelEvent, true);
  }

  /**
   * Removes event listeners
   */
  stopSelecting() {
    if (!isBrowser) return;
    this.container.removeEventListener(
      'mouseover',
      this.elementMouseOver,
      true
    );
    this.container.removeEventListener('click', this.elementClicked, true);
    this.container.removeEventListener('mouseout', this.cancelEvent, true);
    this.container.removeEventListener('mouseenter', this.cancelEvent, true);
    // window.removeEventListener('mouseleave', this.cancelEvent, true);
    // window.removeEventListener('mousedown', this.cancelEvent, true);
    // window.removeEventListener('mouseup', this.cancelEvent, true);

    unHighlight();
  }

  /**
   * Highlights a component on element mouse over
   * @param {MouseEvent} e
   */
  elementMouseOver(e) {
    this.cancelEvent(e);

    const el = e.target;
    if (el) {
      const mouseOverInstance = findRelatedComponent(el);
      if (mouseOverInstance === this.mouseOverInstance) return;
      this.mouseOverInstance = mouseOverInstance;
    }
    if (this.mouseOverInstance) {
      EventBus.$emit('element-mouseover', this.mouseOverInstance);
      highlight(this.mouseOverInstance);
    }
  }

  /**
   * Selects an instance in the component view
   * @param {MouseEvent} e
   */
  // 不在 selector 中做元素选择
  elementClicked(e) {
    // this.cancelEvent(e);
    if (!this.mouseOverInstance) return;
    // 选中编辑元素
    unHighlight();
    this.selectedInstance = this.mouseOverInstance;
    this.mouseOverInstance = null;
    EventBus.$emit('element-selected', this.selectedInstance);
  }

  /**
   * Cancel a mouse event
   * @param {MouseEvent} e
   */
  cancelEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  resetHighlight() {
    highlight(this.mouseOverInstance);
    highlightSelected(this.selectedInstance);
  }
  clearHighlight() {
    unHighlight();
  }
  clearHoverHighlight() {
    this.mouseOverInstance = null;
    unHighlight();
  }
  clearContainerHighlight() {
    this.containerInstance = null;
    unHighlightContainer();
  }
  highlighitMouseoverInstance(instance) {
    this.mouseOverInstance = instance;
    highlight(instance);
  }
  highlighitContainerInstance(instance) {
    this.containerInstance = instance;
    highlightContainer(instance);
  }
  /**
   * Bind class methods to the class scope to avoid rebind for event listeners
   */
  bindMethods() {
    this.startSelecting = this.startSelecting.bind(this);
    this.stopSelecting = this.stopSelecting.bind(this);
    this.elementMouseOver = this.elementMouseOver.bind(this);
    this.elementClicked = this.elementClicked.bind(this);
  }
}
