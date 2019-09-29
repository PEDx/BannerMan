export function arrayMove(arr, previousIndex, newIndex) {
  const array = arr;
  if (newIndex >= array.length) {
    let k = newIndex - array.length;
    while (k-- + 1) {
      array.push(undefined);
    }
  }
  array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
  return array;
}
function getCSSPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }
  return 0;
}
export function closest(el, fn) {
  while (el) {
    if (fn(el)) return el;
    el = el.parentNode;
  }
}
export function getOffset(e) {
  return {
    x: e.pageX,
    y: e.pageY
  };
}
export function limit(min, max, value) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

export function getEdgeOffset(node, offset = { top: 0, left: 0 }) {
  if (node) {
    const nodeOffset = {
      top: offset.top + node.offsetTop,
      left: offset.left + node.offsetLeft
    };
    return nodeOffset;
  }
}
export function getElementMargin(element) {
  const style = window.getComputedStyle(element);

  return {
    top: getCSSPixelValue(style.marginTop),
    right: getCSSPixelValue(style.marginRight),
    bottom: getCSSPixelValue(style.marginBottom),
    left: getCSSPixelValue(style.marginLeft)
  };
}
export function clonePressGhogNodeNode(node) {
  const fields = node.querySelectorAll('input, textarea, select');
  const clonedNode = node.cloneNode(true);
  const clonedFields = [
    ...clonedNode.querySelectorAll('input, textarea, select')
  ];

  clonedFields.forEach((field, index) => {
    if (field.type !== 'file' && fields[index]) {
      field.value = fields[index].value;
    }
  });

  return document.querySelector('body').appendChild(clonedNode);
}
export const RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
