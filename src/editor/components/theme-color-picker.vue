<template>
  <middle-adaption class="theme-picker">
    <div class="option" slot="left" style="padding: 8px 0;">
      <div
        :class="{'item': true, active: currentPickItemIdx == idx}"
        v-for="(val, idx) in themeList"
        :key="idx"
        @click="handleClick(idx)"
      >{{ val.name }}</div>
    </div>
    <div slot="middle">
      <el-row
        :gutter="10"
        class="clan"
        v-for="(val, index) in themeList[currentPickItemIdx].clan"
        :key="index"
      >
        <el-col
          :span="6"
          v-for="(num, idx) in 4"
          :key="index + '' + idx"
          @click.native="handleChangeColor(val.color, idx)"
        >
          <div class="color">
            <div
              class="inner"
              :style="{
                backgroundColor: tinycolor(val.color).setAlpha(`${(10 - idx) / 10}`)
              }"
            ></div>
            <div class="info">
              <div>{{ `${val.name}_${idx}` }}</div>
              <div>rgba(1, 1, 1,.8)</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div slot="right">
      <color-picker :color="colorPickerColor"></color-picker>
    </div>
  </middle-adaption>
</template>
<script>
import middleAdaption from "./middle-adaption";
import tinycolor from "tinycolor2";
import colorPicker from "./color-picker";
const themeList = [
  {
    name: "风暴客",
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
      },
      {
        name: "White",
        color: "#eeeeee"
      },
      {
        name: "Black",
        color: "#333333"
      }
    ]
  },
  {
    name: "青山渐",
    clan: [
      {
        name: "Brand",
        color: "#5776c9"
      },
      {
        name: "Primary",
        color: "#569dd1"
      },
      {
        name: "Accent",
        color: "#63c7df"
      },
      {
        name: "Gray",
        color: "#89e5f4"
      }
    ]
  },
  {
    name: "江上明月",
    clan: [
      {
        name: "Brand",
        color: "#7e7ec6"
      },
      {
        name: "Primary",
        color: "#fcba70"
      },
      {
        name: "Accent",
        color: "#f27a7b"
      },
      {
        name: "Gray",
        color: "#d3c7c0"
      }
    ]
  },
  {
    name: "晚霞雪山",
    clan: [
      {
        name: "Brand",
        color: "#236ad6"
      },
      {
        name: "Primary",
        color: "#2095f2"
      },
      {
        name: "Accent",
        color: "#d7415e"
      },
      {
        name: "Gray",
        color: "#ffd960"
      }
    ]
  }
];

export default {
  components: { middleAdaption, colorPicker },
  data() {
    this.tinycolor = tinycolor;
    return {
      themeList,
      currentPickItemIdx: 0,
      colorPickerColor: "#ffffff"
    };
  },
  methods: {
    handleChangeColor(color, idx) {
      this.colorPickerColor = color;
      this.colorPickerIndex = idx;
    },
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
    padding: 10px;
    .clan-name {
      display: inline-block;
      width: 60px;
      text-align: right;
      font-size: 12px;
      padding-right: 8px;
      box-sizing: border-box;
    }
    .color {
      display: inline-block;
      width: 100%;
      cursor: pointer;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 3px;
      overflow: hidden;
      .inner {
        box-sizing: border-box;
        width: 100%;
        height: 98px;
        position: relative;
        border-bottom: 1px solid #000;
      }
      .info {
        width: 100%;
        font-size: 12px;
        color: #333;
        box-sizing: border-box;
        padding: 4px;
      }
    }
  }
  .float-animation {
    display: inline-block;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    position: relative;
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform;
    transition-property: transform;
  }
  .float-animation:before {
    pointer-events: none;
    position: absolute;
    z-index: -1;
    content: "";
    top: 100%;
    left: 5%;
    height: 10px;
    width: 90%;
    opacity: 0;
    background: -webkit-radial-gradient(
      center,
      ellipse,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.35) 0%,
      rgba(255, 255, 255, 0) 80%
    );
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
    -webkit-transition-property: transform, opacity;
    transition-property: transform, opacity;
  }
  .float-animation:hover,
  .float-animation:focus,
  .float-animation:active {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
  }
  .float-animation:hover:before,
  .float-animation:focus:before,
  .float-animation:active:before {
    opacity: 1;
    -webkit-transform: translateY(6px);
    transform: translateY(6px);
  }
}
</style>
