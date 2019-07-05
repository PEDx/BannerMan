<template>
  <div
    class="widget-container"
    @dragenter.prevent="handleDragenter"
    @dragover.prevent="handleDragover"
    @dragleave.prevent="handleDragleave"
    @drop="handleDrop"
  >
    <slot />
    <sortble-item
      :element-mixin-index="value.length"
      :element-mixin-is-placeholder="true"
      style="position: absolute; top: 0px;left: 0;width: 100%;display: none;"
    >
      <div
        style="width: 100%;height: 80px;line-height: 80px;text-align: center;box-sizing: border-box;background-color: rgba(166, 160, 183, 0.16);"
      >
        <i class="el-icon-plus" style="color: #bbb2a8;font-size: 34px;">+</i>
      </div>
    </sortble-item>
  </div>
</template>
<script>
import { ContainerMixin, SlickItem } from "../../viewport/sortble";
export default {
  components: {
    "sortble-item": SlickItem
  },
  mixins: [ContainerMixin],
  data() {
    this.dragenter = false;
    return {};
  },
  inject: ["rootContainer"],
  mounted() {
    this.$on("sort-start", () => {
      console.log("sortstart");
    });
    this.$on("sort-end", () => {
      console.log("sortend");
    });
  },
  methods: {
    handleDragenter(e) {
      if (this.dragenter) return;
      if (this.rootContainer.dragingType === "drag_resource") return;
      this.hackState(e);
      this.dragenter = true;
    },
    handleDragover(e) {
      if (this.rootContainer.dragingType === "drag_resource") return;
      this.palceholderMove(e);
    },
    handleDragleave(e) {
      if (e.relatedTarget === e.target) console.log(e);
    },
    handleDrop(e) {
      console.log("handleDragleave");
    },
    onDropend() {
      this.dragenter = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.widget-container {
  box-sizing: border-box;
  overflow: auto;
  min-height: 200px;
}
</style>

