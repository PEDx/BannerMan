// Export Sortable Element Component Mixin
export const ElementMixin = {
  inject: ['manager'],
  props: {
    ElementMixinIndex: {
      type: Number,
      required: true
    },
    ElementMixinCollection: {
      type: [String, Number],
      default: 'default'
    },
    ElementMixinDisabled: {
      type: Boolean,
      default: false
    },
    ElementMixinIsPlaceholder: {
      type: Boolean,
      default: false
    }
  },

  mounted() {
    const {
      ElementMixinCollection,
      ElementMixinDisabled,
      ElementMixinIndex
    } = this.$props;

    if (!ElementMixinDisabled) {
      this.setDraggable(ElementMixinCollection, ElementMixinIndex);
    }
  },

  watch: {
    ElementMixinIndex(newIndex) {
      if (this.$el && this.$el.sortableInfo) {
        this.$el.sortableInfo.index = newIndex;
      }
    },
    ElementMixinDisabled(isDisabled) {
      if (isDisabled) {
        this.removeDraggable(this.ElementMixinCollection);
      } else {
        this.setDraggable(this.ElementMixinCollection, this.ElementMixinIndex);
      }
    },
    ElementMixinCollection(newCollection, oldCollection) {
      this.removeDraggable(oldCollection);
      this.setDraggable(newCollection, this.ElementMixinIndex);
    }
  },

  beforeDestroy() {
    const { ElementMixinCollection, ElementMixinDisabled } = this;

    if (!ElementMixinDisabled) this.removeDraggable(ElementMixinCollection);
  },
  methods: {
    setDraggable(collection, index) {
      const node = this.$el;

      node.sortableInfo = {
        index,
        collection,
        manager: this.manager,
        isPlaceholder: this.ElementMixinIsPlaceholder
      };

      this.ref = { node };
      this.manager.add(collection, this.ref);
    },

    removeDraggable(collection) {
      this.manager.remove(collection, this.ref);
    }
  }
};
