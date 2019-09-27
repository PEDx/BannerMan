import SortContainer from '../../sortcontainer/SortContainer';
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
      console.log('widget-container-_handleSortStart');
    },
    _handleSortEnd(info) {
      this.$emit('contianer-sort-end', info);
      console.log('widget-container-_handleSortEnd');
    },
    _handleInsertStart(e) {
      this.$emit('contianer-insert-start', e);
      console.log('widget-container-_handleInsertStart');
    },
    _handleInsertEnd(idx) {
      this.$emit('contianer-insert-end', idx);
      console.log('widget-container-_handleInsertEnd');
    },
    handleDragend() {
      this.$refs.sortbleContainer.handleDragend();
    }
  }
};
