import EventBus from '../bus';
import { highlight, unHighlight, highlightSelected } from './highlighter';
const isBrowser = true;

function findRelatedComponent(el) {
  while (!el.__vue__ && el.parentElement) {
    el = el.parentElement;
  }
  return el.__vue__;
}

export default class ComponentSelector {
  constructor() {
    const self = this;
    self.bindMethods();
  }

  /**
   * Adds event listeners for mouseover and mouseup
   */
  startSelecting() {
    if (!isBrowser) return;
    window.addEventListener('mouseover', this.elementMouseOver, true);
    window.addEventListener('click', this.elementClicked, true);
    window.addEventListener('mouseout', this.cancelEvent, true);
    window.addEventListener('mouseenter', this.cancelEvent, true);
    window.addEventListener('mouseleave', this.cancelEvent, true);
    window.addEventListener('mousedown', this.cancelEvent, true);
    window.addEventListener('mouseup', this.cancelEvent, true);
  }

  /**
   * Removes event listeners
   */
  stopSelecting() {
    if (!isBrowser) return;
    window.removeEventListener('mouseover', this.elementMouseOver, true);
    window.removeEventListener('click', this.elementClicked, true);
    window.removeEventListener('mouseout', this.cancelEvent, true);
    window.removeEventListener('mouseenter', this.cancelEvent, true);
    window.removeEventListener('mouseleave', this.cancelEvent, true);
    window.removeEventListener('mousedown', this.cancelEvent, true);
    window.removeEventListener('mouseup', this.cancelEvent, true);

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
      this.selectedInstance = findRelatedComponent(el);
    }
    if (this.selectedInstance) {
      highlight(this.selectedInstance);
    }
  }

  /**
   * Selects an instance in the component view
   * @param {MouseEvent} e
   */
  elementClicked(e) {
    this.cancelEvent(e);
    // 选中编辑元素
    EventBus.$emit('element-selected', this.selectedInstance);
    unHighlight();
    highlightSelected(this.selectedInstance);
  }

  /**
   * Cancel a mouse event
   * @param {MouseEvent} e
   */
  cancelEvent(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
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
