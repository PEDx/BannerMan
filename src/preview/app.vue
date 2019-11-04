<template>
  <div class="render">
    <components-wrap :components="componentsModelTree"></components-wrap>
  </div>
</template>

<script>
import {
  parseQueryString,
  traversal,
  getProfileByInstance
} from "@utils/index";
import { reqGetPageById } from "@api/page";
const EVENT_CONTROLLER_TYPE = "CTRL_ON_EVENT";
export default {
  data() {
    this.onEventMap = {};
    this.widgetWersionMap = {};
    this.componentProfileMap = {};
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
    this._renderPageFromRemote(pageId);
  },
  methods: {
    _handleWidgetEvent(event, id) {
      const emitEventName = `${id}|${event.type}`;
      const eventHandleList = this.onEventMap[emitEventName];
      eventHandleList && eventHandleList.forEach(handle => handle());
    },
    collectEvent(controllers, id, ins) {
      controllers.forEach(val => {
        if (val.controllerType === EVENT_CONTROLLER_TYPE) {
          const name = ins[val.propName].join("|");
          if (!this.onEventMap[name]) {
            this.onEventMap[name] = [];
          }
          this.onEventMap[name].push(ins[val.handleName]);
        }
      });
    },
    _loadWidgetScript(name, scope = "@banner-man") {
      const verison = this.widgetWersionMap[`${scope}/${name}`];
      return new Promise((resolve, reject) => {
        var script = document.createElement("script");
        script.src = `http://api.bannerman.club/packgages/${scope}/${name}@${verison}/index.js`;
        script.id = `${name}@${verison}`;
        var body_dom = document.body;
        body_dom.appendChild(script);
        // script 加载完毕后调用方法
        script.onload = () => {
          const ins = this.$root.$options.components[name];
          resolve(ins);
        };
        script.onerror = reject;
      });
    },
    _renderPageFromRemote(pageId) {
      console.time("renderPageFromRemote");
      // 此处请求服务端数据可以使预览与端无关.
      reqGetPageById(pageId).then(res => {
        document.title = res.data.name;
        const componentsModelTree = res.data.data;
        this.widgetWersionMap = res.data.widgets_version;
        const _promiseArr = [];
        const _promiseMap = {};
        traversal(componentsModelTree, node => {
          if (!node.props) return;
          Object.keys(node.props).forEach(key => {
            const _val = node.props[key];
            node.props[key] = _val;
          });
          if (_promiseMap[node.name]) return;
          const promise = this._loadWidgetScript(node.name);
          _promiseMap[node.name] = true;
          _promiseArr.push(promise);
        });
        Promise.all(_promiseArr).then(res => {
          res.forEach(val => {
            const profile = val.extendOptions._profile_;
            const name = val.options.name;
            this.componentProfileMap[name] = profile;
          });
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
          console.timeEnd("renderPageFromRemote");
        });
      });
    },
    getProfileByName(name) {
      if (!name) return;
      return this.componentProfileMap[name];
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
