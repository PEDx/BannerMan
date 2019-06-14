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
          ref="ctrls"
        >
          <span slot="label">{{ val.label }}</span>
          <component
            :is="controllerTypeMap[val.controllerType]"
            slot="ctrl"
            :value="val._value"
            @submit-update="handleSubmitUpdate(val.propName, ...arguments)"
          ></component>
        </controller-item>
      </fold-bar>
      <fold-bar title="组件树" slot="right" pos="bottom">
        <component-tree :instances="instancesTree"></component-tree>
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
import { getViewportVueInstance } from "../../utils/index";
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
    const editerSetting = this.$store.state.editer.setting;
    return {
      splitPercent: +editerSetting.rightPanelSplit || 70,
      splitStatus: editerSetting.rightPanelStatus || {
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
        if (e.data.type === "select-component") {
          const ins = getViewportVueInstance();
          const profile = e.data.profile;
          this.controllerList = profile.controllers;
          this.controllerList.forEach(val => {
            val._value = ins.getWidgetDataValue(val.propName);
          });
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        if (e.data.type === "flush-component-tree") {
          this.instancesTree = e.data.instancesTree;
        }
      },
      false
    );
    EventBus.$on("clear-viewport", () => {
      this.controllerList = [];
      this.instancesTree = [];
    });
    EventBus.$on("tree-enter-instance", id => {
      getViewportVueInstance().highilighitInstance(id);
    });
    EventBus.$on("tree-select-instance", id => {
      getViewportVueInstance().highilighitSelectedInstance(id);
    });
  },
  methods: {
    handleSplitChange(data) {
      this.$store.dispatch("update_rt_spt", data.split);
      this.$store.dispatch("update_rt_spt_status", data.status);
    },
    handleSubmitUpdate(key, value) {
      const ins = getViewportVueInstance();
      ins.updateWidgetProp(key, value);
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
}
</style>

