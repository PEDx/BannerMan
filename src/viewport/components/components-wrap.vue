<template>
  <div class="components-wrap">
    <component
      v-for="(item, idx) in components"
      :is="item.name"
      :key="item.id"
      :id="item.id"
      :element-mixin-index="idx"
      :child-components-model="item.children"
      @change-prop="rootContainer._componentPropsChanged(...arguments ,item.id)"
      @children-changed="rootContainer._componentChildrenChanged(...arguments, item.id)"
      @contianer-sort-start="rootContainer._contianerSortStart"
      @contianer-sort-end="rootContainer._contianerSortEnd"
      v-bind="item.props"
    >
      <components-wrap v-if="item.children" :components="item.children"></components-wrap>
    </component>
  </div>
</template>
<script>
export default {
  props: {
    components: {
      type: Array,
      default: () => []
    }
  },
  inject: ["rootContainer"]
};
</script>
