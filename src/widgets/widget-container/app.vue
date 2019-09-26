<template>
  <div class="widget-container">
    <template v-if="inEditor">
      <sort-container
        ref="sortbleContainer"
        :bm-sort-container-data="dataModel"
        @sort-start="_handleSortStart"
        @sort-end="_handleSortEnd"
        @insert-start="_handleInsertStart"
        @insert-end="_handleInsertEnd"
      >
        <slot />
      </sort-container>
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

