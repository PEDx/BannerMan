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
    this.emitEventMap = {};
    this.onEventList = [];
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
    this.pageId = parseQueryString(location.href).id;
    this._renderPageFromLocal();
  },
  methods: {
    _handleWidgetEvent(event, id) {
      const emitEventName = id + event.type;
      this.onEventList.forEach(val => {
        const ins = val.ins;
        if (ins[val.propName].join("") === emitEventName) {
          ins[val.handleName] && ins[val.handleName]();
        }
      });
    },
    _asyncLoadComponent(name) {
      const widget = widgets[name];
      return new Promise((resolve, reject) => {
        widget().then(ins => {
          resolve(ins);
        });
      });
    },
    collectEvent(controllers, id, ins) {
      controllers.forEach(val => {
        if (val.controllerType === "CTRL_EMIT_EVENT") {
          this.emitEventMap[id] = ins[val.propName];
        }
        if (val.controllerType === "CTRL_ON_EVENT") {
          this.onEventList.push({
            propName: val.propName,
            handleName: val.handleName,
            ins
          });
        }
      });
    },
    _renderPageFromLocal() {
      if (!this.pageId) return;
      console.time("renderPageFromLocal");
      const componentsModelTree =
        storage.get(`${LOCAL_SAVE_KEY_PREFIX}_${this.pageId}`) || [];
      const _promiseArr = [];
      const _promiseMap = {};
      traversal(componentsModelTree, node => {
        if (!node.props) return;
        Object.keys(node.props).forEach(key => {
          const _val = node.props[key];
          node.props[key] = _val === UNDEFINED ? undefined : _val;
        });
        if (_promiseMap[node.name]) return;
        const promise = this._asyncLoadComponent(node.name);
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
