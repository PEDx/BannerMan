<template>
  <div
    class="widget-tabs"
    :style="{
      backgroundColor: containerBackgroundObj.color,
      backgroundImage: containerBackgroundObj.url ? `url(${containerBackgroundObj.url})` : '',
      backgroundRepeat: containerBackgroundObj.imgRepeat,
      backgroundSize: containerBackgroundObj.imgSize,
    }"
  >
    <div class="tab-container">
      <ul>
        <li
          class="tab"
          v-for="(num, idx) in tabsCount"
          :key="idx"
          :style="{
            width: `${(100 / tabsCount).toFixed(2)}%`,
          }"
          @click="handleClick(idx)"
        >
          <span
            class="txt"
            :class="{
              selected: selectIdx === idx
            }"
            :style="{
              height: `${tabHeight}px`,
              lineHeight: `${tabHeight}px`,
              borderRadius: `${borderRadius}px`,
              fontSize: `${computeFont(idx).size}px`,
              fontWeight: `${computeFont(idx).weight}`,
              color: computeFont(idx).color,
              border: `${computeBorder(idx).width}px solid ${computeBorder(idx).color}`,
              backgroundColor: computeBackground(idx).color,
              backgroundImage: computeBackground(idx).url ? `url(${computeBackground(idx).url})` : '',
              backgroundRepeat: computeBackground(idx).imgRepeat,
              backgroundSize: computeBackground(idx).imgSize,
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
// fix: 文字小于 12 px ios 边框会上移
export default {
  props: {
    containerBackgroundObj: {
      default: () => ({
        color: "#fff"
      }),
      type: Object
    },
    tabsCount: {
      default: 1,
      type: Number
    },
    tabHeight: {
      default: 36,
      type: Number
    },
    borderRadius: {
      default: 4,
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
    borderObj: {
      default: () => ({ width: 1, color: "#666" }),
      type: Object
    },
    selectedBorderObj: {
      default: () => ({ width: 1, color: "#666" }),
      type: Object
    },
    backgroundObj: {
      default: () => ({
        color: "#fff"
      }),
      type: Object
    },
    selectedBackgroundObj: {
      default: () => ({
        color: "#333"
      }),
      type: Object
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
    computeBorder(idx) {
      return this.selectIdx === idx ? this.selectedBorderObj : this.borderObj;
    },
    computeBackground(idx) {
      return this.selectIdx === idx
        ? this.selectedBackgroundObj
        : this.backgroundObj;
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
  font-size: 0;
  .tab-container {
    .tab {
      display: inline-block;
      text-align: center;
      box-sizing: border-box;
      padding: 0 4px;
      cursor: pointer;
      overflow: hidden;
      font-size: 0;
      .txt {
        display: block;
        width: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
