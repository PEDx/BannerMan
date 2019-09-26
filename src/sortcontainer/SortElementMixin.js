// Export Sortable Element Component Mixin
export default {
  inject: ['manager'],
  props: {
    BmSortElementMixinIndex: {
      type: Number,
      required: true
    },
    BmSortElementMixinCollection: {
      type: [String, Number],
      default: 'default'
    }
  },
  watch: {
    BmSortElementMixinIndex(newIndex) {
      if (this.$el && this.$el.sortableInfo) {
        this.$el.sortableInfo.index = newIndex;
      }
    }
  },
  mounted() {
    const {
      BmSortElementMixinCollection,
      BmSortElementMixinIndex
    } = this.$props;
    this.setDraggable(BmSortElementMixinCollection, BmSortElementMixinIndex);
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
