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
      @sort-start="_handleSortStart"
      @sort-end="_handleSortEnd"
      @input="_handleSortInput"
    >
      <slot />
    </sortble-container>
  </div>
</template>
<script>
import sortbleContainer from "./sortble-container";
import clonedeep from "lodash.clonedeep";
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
    this.newIndex = 0;
    return {
      dataModel: []
    };
  },
  watch: {
    childComponentsModel: {
      deep: true,
      immediate: true,
      handler: function(val) {
        this.dataModel = clonedeep(val);
      }
    }
  },
  methods: {
    _handleSortStart() {
      this.$emit("contianer-sort-start");
    },
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      this.newIndex = newIndex;
      if (newIndex === oldIndex && !isPlaceholder) return; // 没有移动过
      this.$emit("contianer-sort-end");
    },
    _handleSortInput() {
      // 此时数据模型排序完毕
      this.$nextTick(() => {
        this.$emit(
          "children-changed",
          clonedeep(this.dataModel),
          this.dataModel[this.newIndex].id
        );
      });
    }
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

