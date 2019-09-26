import clonedeep from 'lodash.clonedeep';
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
  data() {
    this.wcm_newIndex = 0;
    return {
      dataModel: []
    };
  },
  watch: {
    childComponentsModel: {
      deep: true,
      immediate: true,
      handler: function(val) {
        this.dataModel = clonedeep(val);
      }
    }
  },
  methods: {
    _handleSortStart() {},
    _handleSortEnd() {},
    _handleInsertStart(e) {},
    _handleInsertEnd(e) {}
  }
};
