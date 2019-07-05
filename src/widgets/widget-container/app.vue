<template>
  <div class="widget-container">
    <sortble-container
      v-model="dataModel"
      :lock-to-container-edges="false"
      :hide-sortable-ghost="true"
      :use-window-as-scroll-container="false"
      :distance="10"
      axis="y"
      lock-axis="y"
    >
      <slot />
    </sortble-container>
  </div>
</template>
<script>
import sortbleContainer from "./sortble-container";
export default {
  components: {
    sortbleContainer
  },
  props: {
    childComponentsModel: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dataModel: []
    };
  },
  created() {
    this.dataModel = JSON.parse(JSON.stringify(this.childComponentsModel));
  }
};
</script>
<style lang="scss" scoped>
.widget-container {
  box-sizing: border-box;
  overflow: auto;
  min-height: 200px;
  outline: 1px solid red;
}
</style>

