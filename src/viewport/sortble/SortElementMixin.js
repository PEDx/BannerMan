// Export Sortable Element Component Mixin
export default {
  // tab 内的单个容器不能作为 sort 元素, 只能整个 tabs 作为 sort 元素
  inject: ['manager'],
  props: {
    BmSortElementMixinIndex: {
      type: Number,
      required: true
    },
    BmSortElementMixinDisabled: {
      type: Boolean,
      required: false
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
    },
    BmSortElementMixinDisabled(isDisabled) {
      if (isDisabled) {
        this.removeDraggable(this.ElementMixinCollection);
      } else {
        this.setDraggable(this.ElementMixinCollection, this.ElementMixinIndex);
      }
    }
  },
  mounted() {
    const {
      BmSortElementMixinCollection,
      BmSortElementMixinDisabled,
      BmSortElementMixinIndex
    } = this.$props;
    if (!BmSortElementMixinDisabled) {
      this.setDraggable(BmSortElementMixinCollection, BmSortElementMixinIndex);
    }
  },
  methods: {
    removeDraggable(collection) {
      this.manager.remove(collection, this.ref);
    },
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
