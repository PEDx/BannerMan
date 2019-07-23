<template>
  <div class="widget-container">
    <template v-if="inEditor">
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
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>
<script>
const _BM_EDIT_RUNTIME_ = !!window._BM_EDIT_RUNTIME_;
export default {
  mixins: [_BM_EDIT_RUNTIME_ ? window._BM_WIDGET_CONTAINER_MIXIN_ : ""],
  data() {
    return {
      inEditor: _BM_EDIT_RUNTIME_
    };
  },
  mounted() {
    this.$el._BM_CONTAINER_ = true;
  }
};
</script>
<style lang="scss" scoped>
.widget-container {
  box-sizing: border-box;
  overflow: auto;
  min-height: 300px;
}
</style>

