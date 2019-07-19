<template>
  <div class="components-wrap">
    <component
      v-for="(item, idx) in components"
      :is="item.name"
      :key="item.id"
      :id="item.id"
      :element-mixin-index="idx"
      :child-components-model="item.children"
      :child-deep-level="level"
      @change-prop="rootContainer._componentPropsChanged(...arguments ,item.id)"
      @children-changed="rootContainer._componentChildrenChanged(...arguments, item.id)"
      @contianer-sort-start="rootContainer._contianerSortStart"
      @contianer-sort-end="rootContainer._contianerSortEnd"
      v-bind="item.props"
    >
      <components-wrap v-if="item.children" :components="item.children" :level="deep_index"></components-wrap>
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
    }
  },
  data() {
    return {
      deep_index: this.level + 1
    };
  },
  inject: ["rootContainer"]
};
</script>
