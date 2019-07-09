<template>
  <div class="widget-container">
    <sortble-container
      ref="sortbleContainer"
      v-model="dataModel"
      :lock-to-container-edges="false"
      :hide-sortable-ghost="true"
      :use-window-as-scroll-container="true"
      :distance="10"
      axis="y"
      lock-axis="y"
      @sort-start="_handleSortStart"
      @sort-end="_handleSortEnd"
      @input="_handleSortInput"
    >
      <slot />
    </sortble-container>
  </div>
</template>
<script>
import { WidgetContainerMixin } from "./widget-container-mixin";
export default {
  mixins: [WidgetContainerMixin]
};
</script>
<style lang="scss" scoped>
.widget-container {
  box-sizing: border-box;
  overflow: auto;
  // height: 300px;
  outline: 1px solid red;
}
</style>

