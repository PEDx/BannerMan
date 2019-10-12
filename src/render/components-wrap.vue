<template>
  <div class="components-wrap">
    <div v-for="(item, idx) in components" :key="item.id" class="component-item">
      <component
        :id="item.id"
        :is="item.name"
        :ref="item.id"
        @widget-event="rootRender._handleWidgetEvent(...arguments, item.id)"
        :bm-sort-element-mixin-index="idx"
        :bm-sort-element-mixin-disabled="isMultContainer"
        :child-components-model="item.children"
        :child-deep-level="level"
        v-bind="item.props"
      >
        <template v-if="item.multContainer">
          <components-wrap
            v-for="(val, idx) in item.children"
            :key="idx"
            :slot="`slot_${idx}`"
            :components="[val]"
            :level="deep_index"
            :is-mult-container="true"
          ></components-wrap>
        </template>
        <template v-else>
          <components-wrap
            v-if="item.children && item.children.length > 0"
            :components="item.children"
            :level="deep_index"
          ></components-wrap>
        </template>
      </component>
    </div>
  </div>
</template>
<script>
// const emitEventsMap = {}
// const onEventsMap = {}
// 由 components-wrap 来展开子元素数组
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
    isMultContainer: {
      // 是否是包含多容器的包装容器
      type: Boolean,
      default: false
    }
  },
  inject: ["rootRender"],
  data() {
    return {
      deep_index: this.level + 1
    };
  },
  mounted() {
  }
};
</script>
