import clonedeep from 'lodash.clonedeep';
import sortbleContainer from '../../viewport/components/sortble-container';
export const WidgetContainerMixin = {
  components: {
    sortbleContainer
  },
  props: {
    childComponentsModel: {
      type: Array,
      default: () => []
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
      this.$emit('contianer-sort-start');
    },
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      this.wcm_newIndex = newIndex;
      if (newIndex === oldIndex && !isPlaceholder) return; // 没有移动过
      this.$emit('contianer-sort-end');
    },
    _handleSortInput() {
      // 此时数据模型排序完毕
      this.$nextTick(() => {
        this.$emit(
          'children-changed',
          clonedeep(this.dataModel),
          this.dataModel[this.wcm_newIndex].id
        );
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
