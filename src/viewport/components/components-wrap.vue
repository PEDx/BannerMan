<template>
  <div class="components-wrap">
    <component
      v-for="(item, idx) in components"
      :is="item.name"
      :key="item.id"
      :id="item.id"
      :bm-id="idx"
      :bm-sort-element-mixin-index="idx"
      :element-mixin-disabled="isTabs"
      :child-components-model="item.children"
      :child-deep-level="level"
      @contianer-sort-start="rootContainer._handleSortStart"
      @contianer-sort-end="rootContainer._handleSortEnd"
      @contianer-insert-end="rootContainer._handleInsertEnd"
      @contianer-insert-start="rootContainer._handleInsertStart"
      v-bind="item.props"
    >
      <template v-if="item.multContainer">
        <components-wrap
          v-for="(val, idx) in item.children"
          :key="idx"
          :slot="`slot_${idx}`"
          :components="[val]"
          :level="deep_index"
          :id="`slot_${idx}`"
          :is-tabs="true"
        ></components-wrap>
      </template>
      <template v-else>
        <components-wrap v-if="item.children" :components="item.children" :level="deep_index"></components-wrap>
      </template>
    </component>
  </div>
</template>
<script>
export default {
  props: {
    components: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    },
    isTabs: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deep_index: this.level + 1
    };
  },
  inject: ["rootContainer"],
  mounted() {}
};
</script>
