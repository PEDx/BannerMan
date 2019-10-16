const isVue2 = true;

/**                               公用方法开始                 **/
function isPc() {
  var uaInfo = navigator.userAgent;
  var agents = ['Android', 'iPhone', 'Windows Phone', 'iPad', 'iPod'];
  var flag = true;
  for (var i = 0; i < agents.length; i++) {
    if (uaInfo.indexOf(agents[i]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

function isTap(self) {
  if (isVue2 ? self.disabled : self.el.disabled) {
    return false;
  }
  var tapObj = self.tapObj;
  return (
    self.time < 300 &&
    Math.abs(tapObj.distanceX) < 10 &&
    Math.abs(tapObj.distanceY) < 10
  );
}

function touchstart(e, self) {
  var touches = e.touches[0];
  var tapObj = self.tapObj;
  tapObj.pageX = touches.pageX;
  tapObj.pageY = touches.pageY;
  tapObj.clientX = touches.clientX;
  tapObj.clientY = touches.clientY;
  self.time = +new Date();
}

function touchend(e, self) {
  var touches = e.changedTouches[0];
  var tapObj = self.tapObj;
  self.time = +new Date() - self.time;
  tapObj.distanceX = tapObj.pageX - touches.pageX;
  tapObj.distanceY = tapObj.pageY - touches.pageY;

  if (!isTap(self)) return;
  self.handler(e);
}

export default {
  bind: function(el, binding) {
    el.tapObj = {};
    el.handler = function(e, isPc) {
      // This directive.handler
      var value = binding.value;

      if (!value && el.href && !binding.modifiers.prevent) {
        return (window.location = el.href);
      }

      value.event = e;
      var tagName = value.event.target.tagName.toLocaleLowerCase();
      !isPc ? (value.tapObj = el.tapObj) : null;

      if (tagName === 'input' || tagName === 'textarea') {
        return value.event.target.focus();
      }

      value.methods.call(this, value);
    };
    if (isPc()) {
      el.addEventListener(
        'click',
        function(e) {
          if (binding.modifiers.stop) e.stopPropagation();
          if (binding.modifiers.prevent) e.preventDefault();
          el.handler(e, true);
        },
        false
      );
    } else {
      el.addEventListener(
        'touchstart',
        function(e) {
          if (binding.modifiers.stop) e.stopPropagation();
          if (binding.modifiers.prevent) e.preventDefault();
          touchstart(e, el);
        },
        false
      );
      el.addEventListener(
        'touchend',
        function(e) {
          try {
            Object.defineProperty(e, 'currentTarget', {
              // 重写currentTarget对象 与jq相同
              value: el,
              writable: true,
              enumerable: true,
              configurable: true
            });
          } catch (e) {
            // ios 7下对 e.currentTarget 用defineProperty会报错。
            // 报“TypeError：Attempting to configurable attribute of unconfigurable property”错误
            // 在catch里重写
            console.error(e.message);
            e.currentTarget = el;
          }
          e.preventDefault();

          return touchend(e, el);
        },
        false
      );
    }
  },
  componentUpdated: function(el, binding) {
    el.tapObj = {};
    el.handler = function(e, isPc) {
      // This directive.handler
      var value = binding.value;
      if (!value && el.href && !binding.modifiers.prevent) {
        return (window.location = el.href);
      }
      value.event = e;
      !isPc ? (value.tapObj = el.tapObj) : null;
      value.methods.call(this, value);
    };
  },
  unbind: function(el) {
    // 卸载，别说了都是泪
    el.handler = function() {};
  }
};
