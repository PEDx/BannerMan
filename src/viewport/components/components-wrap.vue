<template>
  <div class="components-wrap">
    <component
      v-for="(item, idx) in components"
      :is="item.name"
      :key="item.id"
      :id="item.id"
      :element-mixin-index="idx"
      :child-components-model="item.children"
      @change-prop="rootContainer._childEmitEven(...arguments ,item.id)"
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
