<template>
  <div class="sort-element">
    <slot />
  </div>
</template>
<script>
export default {
  inject: ["manager"],
  props: {
    ElementMixinIndex: {
      type: Number,
      required: true
    },
    ElementMixinCollection: {
      type: [String, Number],
      default: "default"
    }
  },
  watch: {
    ElementMixinIndex(newIndex) {
      if (this.$el && this.$el.sortableInfo) {
        this.$el.sortableInfo.index = newIndex;
      }
    }
  },
  mounted() {
    const { ElementMixinCollection, ElementMixinIndex } = this.$props;
    this.setDraggable(ElementMixinCollection, ElementMixinIndex);
  },
  methods: {
    setDraggable(collection, index) {
      // debugger;
      const node = this.$el;

      node.sortableInfo = {
        index,
        collection,
        manager: this.manager
      };

      this.ref = { node };
      this.manager.add(this.ref);
    }
  }
};
</script>

<style lang="scss" scoped>
.sort-element {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  outline: 1px solid #666;
  color: #666;
  cursor: pointer;
  user-select: none;
}
</style>

