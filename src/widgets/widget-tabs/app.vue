<template>
  <div class="widget-tabs">
    <div class="tab-container">
      <ul>
        <li
          class="tab"
          v-for="(num, idx) in tabsCount"
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
            :style="{
              fontSize: `${computeFont(idx).size}px`,
              fontWeight: `${computeFont(idx).weight}`,
              color: computeFont(idx).color
            }"
          >{{ tabsTextArr[idx] }}</span>
        </li>
      </ul>
    </div>
    <div class="widget-tabs-content">
      <div class="container" v-for="(num, idx) in tabsCount" :key="num" v-show="selectIdx === idx">
        <slot :name="`slot_${idx}`" />
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
    tabsTextArr: {
      default: () => ["标签"],
      type: Array
    },
    event: {
      default: () => [],
      type: Array
    },
    fontObj: {
      default: () => ({ color: "#000", size: 12, weight: 400 }),
      type: Object
    },
    selectedFontObj: {
      default: () => ({ color: "#f00", size: 12, weight: 400 }),
      type: Object
    }
  },
  data() {
    return {
      value: "",
      selectIdx: 0
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
    computeFont(idx) {
      return this.selectIdx === idx ? this.selectedFontObj : this.fontObj;
    },
    switchTab() {
      this.selectIdx = (this.selectIdx + 1) % this.tabsCount;
    },
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
      cursor: pointer;
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
}
</style>
