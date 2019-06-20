import {
  classify,
  getComponentName,
  getInstanceName,
  getInstanceProfile
} from '../utils/index';
const isBrowser = true;
const classifyComponents = false;

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

let overlay;
let overlayContent;

function initOverlay() {
  if (overlay || !isBrowser) {
    overlay.style.display = 'flex';
    return;
  }
  overlay = document.createElement('div');
  overlay.style.backgroundColor = 'rgba(104, 182, 255, 0.35)';
  overlay.style.position = 'fixed';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  overlay.style.transition = 'all .14s';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.borderRadius = '3px';
  overlayContent = document.createElement('div');
  overlayContent.style.backgroundColor = 'rgba(104, 182, 255, 0.9)';
  overlayContent.style.fontFamily = 'monospace';
  overlayContent.style.fontSize = '11px';
  overlayContent.style.padding = '2px 3px';
  overlayContent.style.borderRadius = '3px';
  overlayContent.style.color = 'white';
  overlay.appendChild(overlayContent);
}

let selectedOverlay;
function initSelectedOverlay() {
  if (selectedOverlay || !isBrowser) {
    selectedOverlay.style.display = 'flex';
    return;
  }
  selectedOverlay = document.createElement('div');
  selectedOverlay.style.position = 'absolute';
  selectedOverlay.style.zIndex = '9998';
  selectedOverlay.style.boxSizing = 'border-box';
  selectedOverlay.style.border = '1px dashed #ff5500';
  selectedOverlay.style.pointerEvents = 'none';
  selectedOverlay.style.display = 'flex';
  selectedOverlay.style.alignItems = 'center';
  selectedOverlay.style.justifyContent = 'center';
  selectedOverlay.style.borderRadius = '3px';
}

/**
 * Highlight an instance.
 *
 * @param {Vue} instance
 */

export function highlight(instance) {
  if (!instance) return;
  const rect = getInstanceOrVnodeRect(instance);

  if (!isBrowser) {
    // TODO: Highlight rect area.
    return;
  }
  initOverlay();
  if (rect) {
    const content = [];
    let compName = instance.fnContext
      ? getComponentName(instance.fnOptions)
      : getInstanceName(instance);
    if (classifyComponents) compName = classify(name);
    const name = getInstanceProfile(instance).name || compName;
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
  const rect = getInstanceOrVnodeRect(instance);

  if (!isBrowser) {
    return;
  }

  initSelectedOverlay();
  if (rect) {
    showOverlay(selectedOverlay, rect);
  }
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

/**
 * Get the client rect for an instance.
 *
 * @param {Vue|Vnode} instance
 * @return {Object}
 */

function isBannerManWidget(instance) {
  if (!instance) return false;
  if (!getInstanceProfile(instance)) return false;
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
    return {
      width: react.width,
      height: react.height,
      top: react.top,
      left: react.left,
      offsetTop: el.offsetTop,
      offsetLeft: el.offsetLeft
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
    overlay.style.top = ~~offsetTop + 'px';
    overlay.style.left = ~~offsetLeft + 'px';
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
