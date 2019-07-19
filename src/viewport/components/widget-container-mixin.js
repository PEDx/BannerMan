import clonedeep from 'lodash.clonedeep';
import sortbleContainer from '../components/sortble-container';
export const WidgetContainerMixin = {
  components: {
    sortbleContainer
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
  mounted() {
    this.$el._BM_CONTAINER_ = true;
  },
  methods: {
    _handleSortStart() {
      this.$emit('contianer-sort-start', this);
    },
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      this.wcm_newIndex = newIndex;
      this.$emit('contianer-sort-end', {
        newIndex,
        oldIndex,
        isPlaceholder,
        collection
      });
      if (newIndex === oldIndex && !isPlaceholder) return; // 没有移动过
    },
    _handleSortInput() {
      // 此时数据模型排序完毕
      this.$nextTick(() => {
        this.$emit('children-changed', clonedeep(this.dataModel));
      });
    },
    hackState(e) {
      this.$refs.sortbleContainer.hackState(e);
    },
    clearHackState(e) {
      this.$refs.sortbleContainer.clearHackState(e);
    },
    palceholderMove(e) {
      this.$refs.sortbleContainer.palceholderMove(e);
    }
  }
};
