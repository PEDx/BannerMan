export function throttle(fn, gapTime) {
  let _lastTime = null;

  return function(arg) {
    const _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(arg);
      _lastTime = _nowTime;
    }
  };
}

export function debounce(func, wait, options) {
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

const ls = window.localStorage;
export const localstore = {
  getItem(key) {
    return ls.getItem(key) || '';
  },
  setItem(key, value) {
    ls.setItem(key, value);
  }
};
