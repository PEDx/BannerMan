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
  mounted() {
    this.$el._BM_CONTAINER_ = true;
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
    },
    hackState(e) {
      this.$refs.sortbleContainer.hackState(e);
    },
    clearHackState(e) {
      this.$refs.sortbleContainer.clearHackState(e);
    },
    palceholderMove(e) {
      this.$refs.sortbleContainer.palceholderMove(e);
    }
  }
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

