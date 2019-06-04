<template>
  <div class="right-panel">
    <fold-bar title="属性" ref="foldBar">
      <controller-item v-for="(val, idx) in controllerList" :key="idx">
        <span slot="label">{{ val.label }}</span>
        <component :is="controllerTypeMap[val.controllerType]" slot="ctrl"></component>
      </controller-item>
    </fold-bar>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
import controllerItem from "../components/controller-item";
import { controllers, controllerTypeMap } from "../controllers";
import EventBus from "../../bus";

export default {
  components: {
    foldBar,
    controllerItem,
    ...controllers
  },
  data() {
    return {
      controllerTypeMap,
      controllerList: []
    };
  },
  mounted() {
    window.addEventListener(
      "message",
      e => {
        if (e.data.type === "select-component") {
          const iframeWindow = window.frames.viewport;
          const instance = iframeWindow._CURRENT_SELECTED_VUE_WIDGET_INSTANCE_;
          const profile = instance._profile_;
          this.controllerList = profile.controllers;
          this.$nextTick(() => {
            EventBus.$emit("reset-fold-bar");
          });
        }
      },
      false
    );
  },
  methods: {
    handleChange() {
      const iframeWindow = window.frames.viewport;
      console.log(
        iframeWindow._CURRENT_SELECTED_VUE_WIDGET_INSTANCE_._profile_
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
}
</style>

