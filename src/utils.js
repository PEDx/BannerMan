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

export function debounce(fn, wait) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, wait);
  };
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
