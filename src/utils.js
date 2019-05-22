export default function throttle(fn, gapTime) {
  let _lastTime = null;

  return function(arg) {
    const _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn(arg);
      _lastTime = _nowTime;
    }
  };
}
