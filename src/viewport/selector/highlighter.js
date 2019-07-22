import {
  classify,
  getComponentName,
  getInstanceName,
  getProfileByInstance
} from '../../utils/index';
const isBrowser = true;
const classifyComponents = false;
const scrollingElement = document.scrollingElement;
function inDoc(node) {
  if (!node) return false;
  var doc = node.ownerDocument.documentElement;
  var parent = node.parentNode;
  return (
    doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && doc.contains(parent))
  );
}

function mapNodeRange(node, end, op) {
  var next;
  while (node !== end) {
    next = node.nextSibling;
    op(node);
    node = next;
  }
  op(end);
}

function isInvisible(rect) {
  return rect.width === 0 && rect.height === 0;
}

let overlay;
let overlayContent;

function initOverlay() {
  if (overlay || !isBrowser) {
    overlay.style.display = 'flex';
    return;
  }
  overlay = document.createElement('div');
  overlay.style.backgroundColor = '#ffab5845';
  overlay.style.position = 'fixed';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  overlay.style.transition = 'all .14s';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.borderRadius = '3px';
  overlayContent = document.createElement('div');
  overlayContent.style.backgroundColor = '#414146';
  overlayContent.style.fontFamily = 'monospace';
  overlayContent.style.fontSize = '11px';
  overlayContent.style.padding = '2px 8px';
  overlayContent.style.borderRadius = '3px';
  overlayContent.style.color = '#fd9527';
  overlay.appendChild(overlayContent);
}

let selectedOverlay;
function initSelectedOverlay() {
  if (selectedOverlay) {
    selectedOverlay.style.display = 'block';
    return;
  }
  selectedOverlay = document.createElement('div');
  selectedOverlay.style.position = 'absolute';
  selectedOverlay.style.zIndex = '9998';
  selectedOverlay.style.boxSizing = 'border-box';
  selectedOverlay.style.border = '1px dashed #ff5500';
  selectedOverlay.style.pointerEvents = 'none';
  selectedOverlay.style.display = 'block';
  selectedOverlay.style.alignItems = 'center';
  selectedOverlay.style.justifyContent = 'center';
  selectedOverlay.style.borderRadius = '3px';
}
let containerOverlay;
function initContainerOverlay(level) {
  if (containerOverlay) {
    containerOverlay.style.display = 'block';
    containerOverlay.style.backgroundColor = `rgba(0, 255, 20, ${0.2 +
      level / 20})`;
    return;
  }
  containerOverlay = document.createElement('div');
  containerOverlay.style.position = 'absolute';
  containerOverlay.className = 'containerOverlay';
  containerOverlay.style.zIndex = '9997';
  containerOverlay.style.boxSizing = 'border-box';
  containerOverlay.style.backgroundColor = 'rgba(0, 255, 20, 0.2)';
  containerOverlay.style.pointerEvents = 'none';
  containerOverlay.style.display = 'flex';
  containerOverlay.style.alignItems = 'center';
  containerOverlay.style.justifyContent = 'center';
  containerOverlay.style.borderRadius = '3px';
}

/**
 * Highlight an instance.
 *
 * @param {Vue} instance
 */

export function highlight(instance) {
  if (!instance) return;
  if (isDisplayNone(instance.$el)) {
    overlay.style.display = 'none';
    return;
  }
  const rect = getInstanceOrVnodeRect(instance);
  if (isInvisible(rect)) {
    overlay.style.display = 'none';
    return;
  }
  initOverlay();
  if (rect) {
    const content = [];
    let compName = instance.fnContext
      ? getComponentName(instance.fnOptions)
      : getInstanceName(instance);
    if (classifyComponents) compName = classify(name);
    const name = getProfileByInstance(instance).name || compName;
    if (name) {
      const pre = document.createElement('span');
      pre.style.opacity = '0.6';
      pre.innerText = '<';
      const text = document.createTextNode(name);
      const post = document.createElement('span');
      post.style.opacity = '0.6';
      post.innerText = '>';
      content.push(pre, text, post);
    }
    showOverlay(overlay, rect, overlayContent, content);
  }
}

export function highlightSelected(instance) {
  if (!instance) return;
  if (isDisplayNone(instance.$el)) {
    selectedOverlay.style.display = 'none';
    return;
  }
  const rect = getInstanceOrVnodeRect(instance);
  if (isInvisible(rect)) {
    overlay.style.display = 'none';
    return;
  }
  if (!isBrowser) {
    return;
  }

  initSelectedOverlay();
  if (rect) {
    showOverlay(selectedOverlay, rect);
  }
}
export function highlightContainer(instance) {
  if (!instance) return;
  if (isDisplayNone(instance.$el)) {
    containerOverlay.style.display = 'none';
    return;
  }
  const rect = getInstanceOrVnodeRect(instance);
  if (!rect) return;
  if (isInvisible(rect)) {
    overlay.style.display = 'none';
    return;
  }
  initContainerOverlay(instance.childDeepLevel || 0);
  showOverlay(containerOverlay, rect);
}
/**
 * Remove highlight overlay.
 */

export function unHighlight() {
  if (overlay && overlay.parentNode) {
    overlay.style.display = 'none';
  }
}
export function unHighlightSelected() {
  if (selectedOverlay && selectedOverlay.parentNode) {
    selectedOverlay.style.display = 'none';
  }
}
export function unHighlightContainer() {
  if (containerOverlay && containerOverlay.parentNode) {
    containerOverlay.style.display = 'none';
  }
}

/**
 * Get the client rect for an instance.
 *
 * @param {Vue|Vnode} instance
 * @return {Object}
 */

function isBannerManWidget(instance) {
  if (!instance) return false;
  if (!getProfileByInstance(instance)) return false;
  return true;
}

export function getInstanceOrVnodeRect(instance) {
  const el = instance.$el || instance.elm;
  if (!isBrowser) {
    return;
  }
  if (!isBannerManWidget(instance)) {
    return;
  }
  if (!inDoc(el)) {
    return;
  }
  if (instance._isFragment) {
    return getFragmentRect(instance);
  } else if (el.nodeType === 1) {
    const react = el.getBoundingClientRect();
    // if (scrollElement.scrollTop > 30) debugger;
    return {
      width: el.clientWidth,
      height: react.height,
      top: react.top,
      left: react.left
    };
  }
}

/**
 * Highlight a fragment instance.
 * Loop over its node range and determine its bounding box.
 *
 * @param {Vue} instance
 * @return {Object}
 */

function getFragmentRect({ _fragmentStart, _fragmentEnd }) {
  let top, bottom, left, right;
  mapNodeRange(_fragmentStart, _fragmentEnd, function(node) {
    let rect;
    if (node.nodeType === 1 || node.getBoundingClientRect) {
      rect = node.getBoundingClientRect();
    } else if (node.nodeType === 3 && node.data.trim()) {
      rect = getTextRect(node);
    }
    if (rect) {
      if (!top || rect.top < top) {
        top = rect.top;
      }
      if (!bottom || rect.bottom > bottom) {
        bottom = rect.bottom;
      }
      if (!left || rect.left < left) {
        left = rect.left;
      }
      if (!right || rect.right > right) {
        right = rect.right;
      }
    }
  });
  return {
    top,
    left,
    width: right - left,
    height: bottom - top
  };
}

let range;
/**
 * Get the bounding rect for a text node using a Range.
 *
 * @param {Text} node
 * @return {Rect}
 */
function getTextRect(node) {
  if (!isBrowser) return;
  if (!range) range = document.createRange();

  range.selectNode(node);

  return range.getBoundingClientRect();
}

/**
 * Display the overlay with given rect.
 *
 * @param {Rect}
 */

function showOverlay(
  overlay,
  { width = 0, height = 0, top = 0, left = 0, offsetTop = 0, offsetLeft = 0 },
  overlayContent = '',
  content = []
) {
  if (!isBrowser) return;

  overlay.style.width = ~~width + 'px';
  overlay.style.height = ~~height + 'px';
  if (!overlayContent) {
    overlay.style.top = ~~top + scrollingElement.scrollTop + 'px';
    overlay.style.left = ~~left + scrollingElement.scrollLeft + 'px';
  } else {
    overlay.style.top = ~~top + 'px';
    overlay.style.left = ~~left + 'px';
  }

  if (overlayContent) {
    overlayContent.innerHTML = '';
    content.forEach(child => overlayContent.appendChild(child));
  }
  if (!overlay.parentNode) {
    document.body.appendChild(overlay);
  }
}
