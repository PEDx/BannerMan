<template>
  <div class="right-panel">
    <fold-bar title="属性">
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
    <fold-bar title="组件树">
      <component-tree :instances="instancesTree"></component-tree>
    </fold-bar>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
import controllerItem from "../components/controller-item";
import componentTree from "../components/component-tree";
import { controllers, controllerTypeMap } from "../controllers";
import EventBus from "../../bus";
import { flushFmt } from "../../utils/index";

export default {
  components: {
    foldBar,
    controllerItem,
    componentTree,
    ...controllers
  },
  data() {
    return {
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
          const ins = this.getViewportVueInstance();
          const profile = e.data.profile;
          this.controllerList = profile.controllers;
          this.controllerList.forEach(val => {
            val._value = ins.getWidgetDataValue(val.propName);
          });
          this.instancesTree = flushFmt([this.getViewportVueInstance()]);
          this.$nextTick(() => {
            EventBus.$emit("reset-fold-bar");
          });
        }
      },
      false
    );
  },
  methods: {
    handleSubmitUpdate(key, value) {
      const ins = this.getViewportVueInstance();
      ins.updateWidgetProp(key, value);
    },
    getViewportVueInstance: (() => {
      let _ins = null;
      return () => {
        if (_ins) return _ins;
        _ins = window.frames.viewport._CURRENT_VIEWPORT_VUE_INSTANCE_;
        return _ins;
      };
    })()
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
}
</style>

