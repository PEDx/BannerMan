<template>
  <div class="right-panel">
    <split-pane
      @split-change="handleSplitChange"
      :split-percent="splitPercent"
      :split-status="splitStatus"
    >
      <fold-bar title="属性" slot="left" pos="top">
        <controller-item
          v-for="(val, idx) in controllerList"
          :key="`${new Date().getTime()}-${idx}`"
        >
          <span slot="label">{{ val.label }}</span>
          <component
            :is="controllerTypeMap[val.controllerType]"
            slot="ctrl"
            :value="val.$value"
            ref="ctrls"
            @submit-update="handleSubmitUpdate(val.propName, ...arguments)"
          ></component>
        </controller-item>
      </fold-bar>
      <fold-bar
        title="组件树"
        slot="right"
        pos="bottom"
        ref="tree"
        @content-scroll-percent="handleContentScroll"
      >
        <component-tree :instances="instancesTree" v-model="instancesTree"></component-tree>
      </fold-bar>
    </split-pane>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
import controllerItem from "../components/controller-item";
import splitPane from "../components/split-pane";
import componentTree from "../components/tree/component-tree";
import { controllers, controllerTypeMap } from "../controllers";
import { getViewportVueInstance, debounce } from "../../utils/index";
import EventBus from "../../bus";

export default {
  components: {
    foldBar,
    controllerItem,
    componentTree,
    splitPane,
    ...controllers
  },
  data() {
    const editorSetting = this.$store.state.editor.setting;
    return {
      splitPercent: +editorSetting.rightPanelSplit || 70,
      splitStatus: editorSetting.rightPanelStatus || {
        top: true,
        bottom: true
      },
      controllerTypeMap,
      controllerList: [],
      instancesTree: [],
      currentUid: null
    };
  },
  mounted() {
    window.addEventListener(
      "message",
      e => {
        // 选定一个元素
        if (e.data.type === "select-component") {
          const ins = getViewportVueInstance();
          e.data.profile.controllers.forEach(val => {
            val.$value = undefined;
          });
          const profile = e.data.profile;
          this.controllerList = profile.controllers;
          this.controllerList.forEach(val => {
            val.$value = ins.getWidgetDataValue(val.propName);
          });
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 刷新组件树
        if (e.data.type === "flush-component-tree") {
          this.instancesTree = e.data.instancesTree;
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 滚动条同步
        if (e.data.type === "viewport-scroll-percent") {
          this.viewportSrcolling = true;
          this.$refs.tree.contentScrollTo(+e.data.percent);
          this.scrollEnd();
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 刷新控制器列表数值
        if (e.data.type === "flush-controller-value") {
          const ins = getViewportVueInstance();
          this.controllerList.forEach(val => {
            val.$value = ins.getWidgetDataValue(val.propName);
          });
        }
      },
      false
    );
    EventBus.$on("clear-viewport", () => {
      this.controllerList = [];
      this.instancesTree = [];
    });
    EventBus.$on("tree-enter-instance", id => {
      getViewportVueInstance().highlighitInstance(id);
    });
    EventBus.$on("tree-select-instance", id => {
      getViewportVueInstance().highlighitSelectedInstance(id);
    });
    this.scrollEnd = debounce(() => {
      this.viewportSrcolling = false;
    }, 500);
  },
  methods: {
    handleSplitChange(data) {
      this.$store.dispatch("update_rt_spt", data.split);
      this.$store.dispatch("update_rt_spt_status", data.status);
    },
    handleSubmitUpdate(key, value) {
      const ins = getViewportVueInstance();
      ins.updateWidgetProp(key, value);
    },
    handleContentScroll(percent) {
      // 此处会相互触发 srcoll 事件, 需要防止
      if (this.viewportSrcolling) return;
      const ins = getViewportVueInstance();
      ins.viewportScrollTo(percent);
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
}
</style>

