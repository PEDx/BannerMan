import EventBus from '../bus';
import {
  highlight,
  unHighlight,
  unHighlightSelected,
  highlightSelected
} from './highlighter';
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
      this.mouseOverInstance = findRelatedComponent(el);
    }
    if (this.mouseOverInstance) {
      highlight(this.mouseOverInstance);
    }
  }

  /**
   * Selects an instance in the component view
   * @param {MouseEvent} e
   */
  elementClicked(e) {
    this.cancelEvent(e);
    if (!this.mouseOverInstance) return;
    // 选中编辑元素
    EventBus.$emit('element-selected', this.mouseOverInstance);

    unHighlight();
    this.selectedInstance = this.mouseOverInstance;
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

  resetHighlight() {
    highlight(this.mouseOverInstance);
    highlightSelected(this.selectedInstance);
  }
  clearHighlight() {
    unHighlight();
    unHighlightSelected();
  }
  highilighitMouseoverInstance(instance) {
    this.mouseOverInstance = instance;
    highlight(instance);
  }
  highilighitSelectedInstance(instance) {
    this.selectedInstance = instance;
    highlightSelected(instance);
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
