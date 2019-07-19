<template>
  <div class="widget-tabs">
    <div class="tab-container">
      <ul>
        <li
          class="tab"
          v-for="idx in tabsCount"
          :key="idx"
          :style="{
            width: `${(100 / tabsCount).toFixed(2)}%`
          }"
          @click="handleClick(idx)"
        >
          <span
            class="txt"
            :class="{
              selected: selectIdx === idx
            }"
          >标签{{ idx }}</span>
        </li>
      </ul>
    </div>
    <div class="widget-tabs-content">
      <div class="container" v-for="(num, idx) in tabsCount" :key="num" v-show="selectIdx === num">
        <common-container
          ref="container"
          :element-mixin-disabled="true"
          :element-mixin-index="0"
          :child-components-model="childComponentsModel[idx]"
          :child-deep-level="childDeepLevel"
          @children-changed="_handleSortInput"
          @contianer-sort-start="_handleSortStart"
          @contianer-sort-end=" _handleSortEnd"
        >
          <slot :name="`slot_${idx}`" />
        </common-container>
      </div>
    </div>
  </div>
</template>
<script>
const _BM_EDIT_RUNTIME_ = !!window._BM_EDIT_RUNTIME_;
import commonContainer from "../common-container/index";
export default {
  components: {
    commonContainer
  },
  props: {
    tabsCount: {
      default: 1,
      type: Number
    },
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
    return {
      value: "",
      selectIdx: 1,
      inEditor: _BM_EDIT_RUNTIME_
    };
  },
  mounted() {
    this.$el._BM_CONTAINER_ = true;
  },
  methods: {
    handleClick(idx) {
      this.selectIdx = idx;
    },
    _handleSortStart() {
      // debugger;
      this.$emit("contianer-sort-start", this);
    },
    _handleSortEnd({ newIndex, oldIndex, isPlaceholder, collection }) {
      // debugger;
      this.$emit("contianer-sort-end", {
        newIndex,
        oldIndex,
        isPlaceholder,
        collection
      });
    },
    _handleSortInput(dataModel) {
      // debugger;
      this.$emit("children-changed", dataModel);
    },
    hackState(e) {
      this.$refs.container[this.selectIdx - 1].hackState(e);
    },
    clearHackState(e) {
      this.$refs.container[this.selectIdx - 1].clearHackState(e);
    },
    palceholderMove(e) {
      this.$refs.container[this.selectIdx - 1].palceholderMove(e);
    }
  }
};
</script>
<style lang="scss" scoped>
.widget-tabs {
  box-sizing: border-box;
  min-height: 40px;
  .tab-container {
    .tab {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      height: 100%;
      text-align: center;
      box-sizing: border-box;
      padding: 0 4px;
      .txt {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
      .selected {
        background-color: antiquewhite;
      }
    }
  }
  .widget-tabs-content {
  }
}
</style>
