import SortContainer from '../sortble/SortContainer';
export const WidgetContainerMixin = {
  components: {
    SortContainer
  },
  props: {
    childComponentsModel: {
      type: Array,
      default: () => []
    },
    childDeepLevel: {
      type: Number,
      default: 1
    }
  },
  methods: {
    _handleSortStart() {
      this.$emit('contianer-sort-start');
      // console.log('widget-container-_handleSortStart');
    },
    _handleSortEnd(info) {
      this.$emit('contianer-sort-end', info);
      // console.log('widget-container-_handleSortEnd');
    },
    _handleDragStart(ins) {
      this.$emit('contianer-drag-start', ins);
      // console.log('widget-container-_handleInsertStart');
    },
    _handleInsertStart(e) {
      this.$emit('contianer-insert-start', e);
      // console.log('widget-container-_handleInsertStart');
    },
    _handleInsertEnd(idx) {
      this.$emit('contianer-insert-end', idx);
      // console.log('widget-container-_handleInsertEnd');
    },
    handleDropEnd(e) {
      this.$refs.sortbleContainer.handleDropEnd(e);
    },
    triggerDragEnd(e) {
      this.$refs.sortbleContainer.triggerDragEnd(e);
    }
  }
};
