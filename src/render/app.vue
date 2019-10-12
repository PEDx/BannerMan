<template>
  <div class="render">
    <components-wrap :components="componentsModelTree"></components-wrap>
  </div>
</template>

<script>
import {
  parseQueryString,
  traversal,
  UNDEFINED,
  getProfileByInstance
} from "@utils/index";
import storage from "@/storage";
import widgets from "@/widgets";
const LOCAL_SAVE_KEY_PREFIX = "current_viewport_data";
export default {
  data() {
    this.onEventMap = {};
    return {
      componentsModelTree: []
    };
  },
  provide() {
    return {
      rootRender: this
    };
  },
  mounted() {
    const pageId = parseQueryString(location.href).id;
    this._renderPageFromLocal(pageId);
  },
  methods: {
    _handleWidgetEvent(event, id) {
      const emitEventName = `${id}|${event.type}`;
      const eventHandleList = this.onEventMap[emitEventName];
      eventHandleList && eventHandleList.forEach(handle => handle());
    },
    collectEvent(controllers, id, ins) {
      controllers.forEach(val => {
        if (val.controllerType === "CTRL_ON_EVENT") {
          const name = ins[val.propName].join("|");
          if (!this.onEventMap[name]) {
            this.onEventMap[name] = [];
          }
          this.onEventMap[name].push(ins[val.handleName]);
        }
      });
    },
    _renderPageFromLocal(pageId) {
      if (!pageId) return;
      console.time("renderPageFromLocal");
      const componentsModelTree =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${pageId}`) || [];
      const _promiseArr = [];
      const _promiseMap = {};
      traversal(componentsModelTree, node => {
        if (!node.props) return;
        Object.keys(node.props).forEach(key => {
          const _val = node.props[key];
          node.props[key] = _val === UNDEFINED ? undefined : _val;
        });
        if (_promiseMap[node.name]) return;
        const promise = widgets[node.name]();
        _promiseMap[node.name] = true;
        _promiseArr.push(promise);
      });
      Promise.all(_promiseArr).then(res => {
        this.componentsModelTree = componentsModelTree;
        this.$nextTick(() => {
          traversal(this.componentsModelTree, node => {
            const element = document.getElementById(node.id);
            if (!element) return;
            const instance = element.__vue__;
            const _profile = getProfileByInstance(instance);
            this.collectEvent(_profile.controllers, node.id, instance);
          });
        });
        console.timeEnd("renderPageFromLocal");
      });
    }
  }
};
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
.render {
  background-color: #fff;
  height: 100%;
  width: 100%;
}
</style>
