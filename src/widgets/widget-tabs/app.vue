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
        <slot :name="`slot_${idx}`"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
      selectIdx: 1
    };
  },
  watch: {
    tabsCount(value) {
      this.$emit("tabs-count-changed", value);
    }
  },
  created() {
    this.$emit("tabs-count-changed", this.tabsCount);
  },
  methods: {
    handleClick(idx) {
      this.selectIdx = idx;
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
