import path from 'path';
import { getInstanceOrVnodeRect } from '../viewport/highlighter';
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

var classifyRE = /(?:^|[-_/])(\w)/g;
export const classify = cached(str => {
  return str && str.replace(classifyRE, toUpper);
});

export function getComponentName(options) {
  const name = options.name || options._componentTag;
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

const filter = '';

export function findQualifiedChildrenFromList(instances) {
  instances = instances.filter(child => !child._isBeingDestroyed);
  return !filter
    ? instances.map(capture)
    : Array.prototype.concat.apply([], instances.map(findQualifiedChildren));
}

function findQualifiedChildren(instance) {
  return isQualified(instance)
    ? capture(instance)
    : findQualifiedChildrenFromList(instance.$children).concat(
      instance._vnode && instance._vnode.children
        ? flatten(
          instance._vnode.children
            .filter(child => !child.componentInstance)
            .map(captureChild)
        )
        // Filter qualified children.
          .filter(instance => isQualified(instance))
        : []
    );
}

function isQualified(instance) {
  const name = classify(
    instance.name || getInstanceName(instance)
  ).toLowerCase();
  return name.indexOf(filter) > -1;
}

function flatten(items) {
  return items.reduce((acc, item) => {
    if (item instanceof Array) acc.push(...flatten(item));
    else if (item) acc.push(item);

    return acc;
  }, []);
}

function captureChild(child) {
  if (child.fnContext && !child.componentInstance) {
    return capture(child);
  } else if (child.componentInstance) {
    if (!child.componentInstance._isBeingDestroyed) {
      return capture(child.componentInstance);
    }
  } else if (child.children) {
    return flatten(child.children.map(captureChild));
  }
}

function getRenderKey(value) {
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

const functionalVnodeMap = new Map();
function markFunctional(id, vnode) {
  const refId = vnode.fnContext._EDITER_TREE_UID__;
  if (!functionalVnodeMap.has(refId)) {
    functionalVnodeMap.set(refId, {});
    vnode.fnContext.$on('hook:beforeDestroy', function() {
      functionalVnodeMap.delete(refId);
    });
  }

  functionalVnodeMap.get(refId)[id] = vnode;
}
export const instanceMap = new Map();
function mark(instance) {
  if (!instanceMap.has(instance._EDITER_TREE_UID__)) {
    instanceMap.set(instance._EDITER_TREE_UID__, instance);
    instance.$on('hook:beforeDestroy', function() {
      instanceMap.delete(instance._EDITER_TREE_UID__);
    });
  }
}
function getUniqueId(instance) {
  const rootVueId = instance.$root._uid;
  return `${rootVueId}:${instance._uid}`;
}

const functionalIds = new Map();
const captureIds = new Map();

function capture(instance, index, list) {
  if (
    instance.$options &&
    instance.$options.abstract &&
    instance._vnode &&
    instance._vnode.componentInstance
  ) {
    instance = instance._vnode.componentInstance;
  }

  // Functional component.
  if (instance.fnContext && !instance.componentInstance) {
    const contextUid = instance.fnContext._EDITER_TREE_UID__;
    let id = functionalIds.get(contextUid);
    if (id == null) {
      id = 0;
    } else {
      id++;
    }
    functionalIds.set(contextUid, id);
    const functionalId = contextUid + ':functional:' + id;
    markFunctional(functionalId, instance);
    return {
      id: functionalId,
      functional: true,
      name: getInstanceName(instance),
      renderKey: getRenderKey(instance.key),
      children: (instance.children
        ? instance.children.map(child =>
          child.fnContext
            ? captureChild(child)
            : child.componentInstance
              ? capture(child.componentInstance)
              : undefined
        )
        : instance.componentInstance
          ? [capture(instance.componentInstance)]
          : []
      ).filter(Boolean),
      inactive: false,
      isFragment: false // TODO: Check what is it for.
    };
  }
  // instance._uid is not reliable in devtools as there
  // may be 2 roots with same _uid which causes unexpected
  // behaviour
  instance._EDITER_TREE_UID__ = getUniqueId(instance);

  // Dedupe
  if (captureIds.has(instance._EDITER_TREE_UID__)) {
    return;
  } else {
    captureIds.set(instance._EDITER_TREE_UID__, undefined);
  }

  mark(instance);
  const name = getInstanceName(instance);

  const ret = {
    uid: instance._uid,
    id: instance._EDITER_TREE_UID__,
    name,
    chn_name: instance._profile_.name,
    renderKey: getRenderKey(instance.$vnode ? instance.$vnode['key'] : null),
    inactive: !!instance._inactive,
    isFragment: !!instance._isFragment,
    children: instance.$children
      .filter(child => !child._isBeingDestroyed)
      .map(capture)
      .filter(Boolean)
  };

  if (instance._vnode && instance._vnode.children) {
    ret.children = ret.children.concat(
      flatten(instance._vnode.children.map(captureChild)).filter(Boolean)
    );
  }

  // record screen position to ensure correct ordering
  if ((!list || list.length > 1) && !instance._inactive) {
    const rect = getInstanceOrVnodeRect(instance);
    ret.top = rect ? rect.top : Infinity;
  } else {
    ret.top = Infinity;
  }

  // check router view
  const isRouterView2 = instance.$vnode && instance.$vnode.data.routerView;
  if (instance._routerView || isRouterView2) {
    ret.isRouterView = true;
    if (!instance._inactive && instance.$route) {
      const matched = instance.$route.matched;
      const depth = isRouterView2
        ? instance.$vnode.data.routerViewDepth
        : instance._routerView.depth;
      ret.matchedRouteSegment =
        matched &&
        matched[depth] &&
        (isRouterView2 ? matched[depth].path : matched[depth].handler.path);
    }
  }
  return ret;
}

export function generateInstanceBriefObj(rootInstances) {
  functionalIds.clear();
  captureIds.clear();
  return findQualifiedChildrenFromList(rootInstances);
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

function sanitize(data) {
  if (!isPrimitive(data) && !Array.isArray(data) && !isPlainObject(data)) {
    return Object.prototype.toString.call(data);
  } else {
    return data;
  }
}

function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isPrimitive(data) {
  if (data == null) {
    return true;
  }
  const type = typeof data;
  return type === 'string' || type === 'number' || type === 'boolean';
}

const UNDEFINED = '_BM_UNDEFINED_'; // jason 可序列化值为 undefined
export function stringify(data) {
  return JSON.stringify(data, (key, val) => {
    // debugger;
    const type = typeof val;
    if (type === 'undefined') return UNDEFINED;
    return sanitize(val);
  });
}
export function parse(data) {
  return JSON.parse(data, (key, val) => {
    if (val === UNDEFINED) return void 0;
    return val;
  });
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
