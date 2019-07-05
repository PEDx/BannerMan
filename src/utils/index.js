import path from 'path';

function toUpper(_, c) {
  return c ? c.toUpperCase() : '';
}

function basename(filename, ext) {
  return path.basename(
    filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'),
    ext
  );
}
function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

function sanitize(data) {
  if (!isPrimitive(data) && !Array.isArray(data) && !isPlainObject(data)) {
    return Object.prototype.toString.call(data);
  } else {
    return data;
  }
}

export function flatten(items) {
  return items.reduce((acc, item) => {
    if (item instanceof Array) acc.push(...flatten(item));
    else if (item) acc.push(item);

    return acc;
  }, []);
}

export function getRenderKey(value) {
  if (value == null) return;
  const type = typeof value;
  if (type === 'number') {
    return value;
  } else if (type === 'string') {
    return `'${value}'`;
  } else if (Array.isArray(value)) {
    return 'Array';
  } else {
    return 'Object';
  }
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function isPrimitive(data) {
  if (data == null) {
    return true;
  }
  const type = typeof data;
  return type === 'string' || type === 'number' || type === 'boolean';
}

export function scrollIntoView(scrollParent, el, center = true) {
  const parentTop = scrollParent.scrollTop;
  const parentHeight = scrollParent.offsetHeight;
  const elBounds = el.getBoundingClientRect();
  const parentBounds = scrollParent.getBoundingClientRect();
  const top = elBounds.top - parentBounds.top + scrollParent.scrollTop;
  const height = el.offsetHeight;
  if (center) {
    scrollParent.scrollTop = top + (height - parentHeight) / 2;
  } else if (top < parentTop) {
    scrollParent.scrollTop = top;
  } else if (top + height > parentTop + parentHeight) {
    scrollParent.scrollTop = top - parentHeight + height;
  }
}

export function clamp(x, min, max) {
  if (x > max) return max;
  if (x < min) return min;
  return x;
}

export const getViewportVueInstance = (() => {
  let _ins = null;
  return () => {
    if (_ins) return _ins;
    _ins = window.frames.viewport._CURRENT_VIEWPORT_VUE_INSTANCE_;
    return _ins;
  };
})();

var classifyRE = /(?:^|[-_/])(\w)/g;
export const classify = cached(str => {
  return str && str.replace(classifyRE, toUpper);
});

export function getComponentName(options) {
  const name =
    (options._profile_ && options._profile_.name) ||
    options.name ||
    options._componentTag;
  if (name) {
    return name;
  }
  const file = options.__file; // injected by vue-loader
  if (file) {
    return classify(basename(file, '.vue'));
  }
}

export function getInstanceName(instance) {
  const name = getComponentName(instance.$options || instance.fnOptions || {});
  if (name) return name;
  return instance.$root === instance ? 'Root' : 'Anonymous Component';
}

export function focusInput(el) {
  el.focus();
  el.setSelectionRange(0, el.value.length);
}

const restArguments = function(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function() {
    const length = Math.max(arguments.length - startIndex, 0);
    const rest = Array(length);
    let index = 0;
    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }
    switch (startIndex) {
      case 0:
        return func.call(this, rest);
      case 1:
        return func.call(this, arguments[0], rest);
      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }
    var args = Array(startIndex + 1);
    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }
    args[startIndex] = rest;
    return func.apply(this, args);
  };
};
const delay = restArguments(function(func, wait, args) {
  return setTimeout(function() {
    return func.apply(null, args);
  }, wait);
});

// 函数去抖
export function debounce(func, wait, immediate) {
  var timeout, result;

  var later = function(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function(args) {
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}

// 函数节流
export function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

export const UNDEFINED = '_BM_UNDEFINED_'; // jason 可序列化值为 undefined
export function stringify(data) {
  return JSON.stringify(data, (key, val) => {
    // debugger;
    const type = typeof val;
    if (type === 'undefined') return UNDEFINED;
    return sanitize(val);
  });
}
export function parse(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
}

export function parseQueryString(url) {
  let arr;
  const res = {};
  url = url.split('#')[0];
  arr = url.split('?');
  arr.shift();
  const queryStr = arr.join('?');
  if (queryStr.trim().length === 0) {
    return res;
  }
  arr = queryStr.split('&');
  for (let i = 0; i < arr.length; i++) {
    const itemArr = arr[i].split('=');
    const name = itemArr.shift();
    const value = itemArr.join('=');
    res[name] = value;
  }
  return res;
}

export function getInstanceProfile(instance) {
  if (!instance) return null;
  return instance.$options._profile_ || null;
}
export function findRelatedComponent(el) {
  while (!el.__vue__ && el.parentElement) {
    el = el.parentElement;
  }
  return el.__vue__;
}

export function serialization(promise_arr) {
  return new Promise((resolve, reject) => {
    let idx = 0;
    const _arr = [];
    function step(ins) {
      const promise = promise_arr[idx];
      ins && _arr.push(ins);
      if (!promise) {
        resolve(_arr);
        return;
      }
      promise.then(step);
      idx++;
    }
    step();
  });
}

export function getRandomStr(len) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function traversal(root, callback) {
  function walk(node) {
    callback(node);
    node.children && node.children.forEach(walk);
  }
  root.forEach(walk);
}
