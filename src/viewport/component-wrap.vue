<template>
  <div class="component-wrap">
    <component
      v-for="(item, idx) in components"
      :is="item.name"
      :key="item.id"
      :id="item.id"
      :element-mixin-index="idx"
      @change-prop="rootContainer._childEmitEven(...arguments ,item.id)"
      v-bind="item.props"
    >
      <component-wrap v-if="item.children" :components="item.children"></component-wrap>
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
