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
                backgroundColor: val.colors[idx]
              }"
            ></div>
            <div class="info">
              <div>{{ `${val.name}_${idx}` }}</div>
              <div>{{ val.colors[idx] }}</div>
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
        main: "#3b989b",
        colors: []
      },
      {
        name: "Primary",
        main: "#ee5872",
        colors: []
      },
      {
        name: "Accent",
        main: "#5678a3",
        colors: []
      },
      {
        name: "Gray",
        main: "#e3e4e6",
        colors: []
      },
      {
        name: "White",
        main: "#eeeeee",
        colors: []
      },
      {
        name: "Black",
        main: "#333333",
        colors: []
      }
    ]
  },
  {
    name: "青山渐",
    clan: [
      {
        name: "Brand",
        main: "#5776c9",
        colors: []
      },
      {
        name: "Primary",
        main: "#569dd1",
        colors: []
      },
      {
        name: "Accent",
        main: "#63c7df",
        colors: []
      },
      {
        name: "Gray",
        main: "#89e5f4",
        colors: []
      }
    ]
  },
  {
    name: "江上明月",
    clan: [
      {
        name: "Brand",
        main: "#7e7ec6",
        colors: []
      },
      {
        name: "Primary",
        main: "#fcba70",
        colors: []
      },
      {
        name: "Accent",
        main: "#f27a7b",
        colors: []
      },
      {
        name: "Gray",
        main: "#d3c7c0",
        colors: []
      }
    ]
  },
  {
    name: "晚霞雪山",
    clan: [
      {
        name: "Brand",
        main: "#236ad6",
        colors: []
      },
      {
        name: "Primary",
        main: "#2095f2",
        colors: []
      },
      {
        name: "Accent",
        main: "#d7415e",
        colors: []
      },
      {
        name: "Gray",
        main: "#ffd960",
        colors: []
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
  created() {
    this.themeList.forEach(val => {
      val.clan.forEach(val2 => {
        Array.from({ length: 4 }).forEach((v, idx) => {
          const _color = tinycolor(val2.main)
            .setAlpha(`${(10 - idx) / 10}`)
            .toRgbString();
          val2.colors.push(_color);
        });
      });
    });
  },
  methods: {
    handleChangeColor(color, idx) {
      this.colorPickerColor = tinycolor(color).toHexString();
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
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
