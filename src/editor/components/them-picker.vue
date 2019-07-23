<template>
  <right-adaption class="theme-picker">
    <div class="option" slot="left">
      <div
        :class="{'item': true, active: currentPickItemIdx == idx}"
        v-for="(val, idx) in themeList"
        :key="idx"
        @click="handleClick(idx)"
      >{{ val.name }}</div>
    </div>
    <div class="content" slot="right">
      <ul class="clan" v-for="(val, idx) in themeList[currentPickItemIdx].clan" :key="idx">
        <span class="clan-name">{{ val.name }}</span>
        <li
          class="color"
          v-for="(num, idx) in 9"
          :key="idx"
          :style="{
            backgroundColor: `${val.color}`
          }"
        ></li>
      </ul>
    </div>
  </right-adaption>
</template>
<script>
import rightAdaption from "./right-adaption";
const themeList = [
  {
    name: "Toyland",
    clan: [
      {
        name: "Brand",
        color: "#3b989b"
      },
      {
        name: "Primary",
        color: "#ee5872"
      },
      {
        name: "Accent",
        color: "#5678a3"
      },
      {
        name: "Gray",
        color: "#e3e4e6"
      }
    ]
  },
  {
    name: "Perwinkle",
    clan: [
      {
        name: "Brand",
        color: "#0f0"
      },
      {
        name: "Primary",
        color: "#0f0"
      },
      {
        name: "Accent",
        color: "#0f0"
      },
      {
        name: "Gray",
        color: "#0f0"
      }
    ]
  },
  {
    name: "Glassdoor",
    clan: [
      {
        name: "Brand",
        color: "#0f0"
      },
      {
        name: "Primary",
        color: "#0f0"
      },
      {
        name: "Accent",
        color: "#0f0"
      },
      {
        name: "Gray",
        color: "#0f0"
      }
    ]
  },
  {
    name: "Mutable",
    clan: [
      {
        name: "Brand",
        color: "#0f0"
      },
      {
        name: "Primary",
        color: "#0f0"
      },
      {
        name: "Accent",
        color: "#0f0"
      },
      {
        name: "Gray",
        color: "#0f0"
      }
    ]
  }
];

export default {
  components: { rightAdaption },
  data() {
    return {
      themeList,
      currentPickItemIdx: 0
    };
  },
  methods: {
    handleClick(idx) {
      this.currentPickItemIdx = idx;
    }
  }
};
</script>
<style lang="scss" scoped>
.theme-picker {
  .item {
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    box-sizing: border-box;
    padding: 0 8px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 1px;
    &:hover {
      background-color: #252525;
      // color: #fd9527;
    }
    &:focus {
      outline: 0;
    }
    &:active {
      outline: 0;
    }
  }
  .active {
    background-color: #252525;
    color: #fd9527;
    outline: 0;
  }
  .clan {
    display: flex;
    justify-content: space-between;
    margin-top: 14px;
    padding: 0 10px;
    box-sizing: border-box;
    line-height: 34px;
    .clan-name {
      display: inline-block;
      width: 40px;
      text-align: right;
      font-size: 12px;
    }
    .color {
      display: inline-block;
      width: 34px;
      height: 34px;
      line-height: 34px;
      border-radius: 50%;
    }
  }
}
</style>
