<template>
  <div class="top-bar">
    <div class="logo">
      <div class="temporary">
        <logo />
        <h1 class="txt">Banner Man</h1>
      </div>
    </div>
    <div class="function">
      <el-row style="height: 100%;">
        <el-col :span="8"></el-col>
        <el-col :span="8" style="text-align: center;">
          <el-select v-model="value" placeholder="请选择" style="width: 210px;" @change="handleChange">
            <template slot="prefix">
              <i class="el-icon-view"></i>
            </template>
            <el-option
              v-for="(item, key) in options"
              :key="key"
              :label="`${item.desc} / (${item.resolution.width}x${item.resolution.height})`"
              :value="key"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-popover placement="top" width="160" v-model="clearConfirmVisible">
            <p>确认清空全部组件？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="clearConfirmVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="clearViewportPage">确定</el-button>
            </div>
            <el-button
              slot="reference"
              type="primary"
              icon="el-icon-delete-solid"
              style="margin-left: 10px;"
            >清空</el-button>
          </el-popover>

          <el-button type="primary" icon="el-icon-mobile-phone" style="margin-left: 10px;">预览</el-button>
          <el-button
            type="primary"
            icon="el-icon-document-checked"
            style="margin-left: 10px;"
            @click="saveViewportPage"
          >保存</el-button>
          <el-dropdown trigger="click">
            <el-button type="primary" style="margin-left: 10px;">
              更多
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-coffee-cup"
                @click.native="handleShowThemeWindow"
              >主题调色板</el-dropdown-item>
              <el-dropdown-item icon="el-icon-cpu">燃烧 GPU</el-dropdown-item>
              <el-dropdown-item icon="el-icon-user-solid">用户设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <float-window :show.sync="showThemeWindow" :position="nodePos" :size="nodeSize" title="主题调色板">
      <them-picker></them-picker>
    </float-window>
  </div>
</template>
<script>
import floatWindow from "./components/float-window";
import themPicker from "./components/them-picker";
import deviceModelList from "./device";
import EventBus from "../bus";
import logo from "./logo";
import { getViewportVueInstance } from "../utils/index";

export default {
  components: { logo, floatWindow, themPicker },
  data() {
    return {
      clearConfirmVisible: false,
      showThemeWindow: true,
      options: deviceModelList,
      value: this.$store.state.editor.setting.deviceType || "iphone6",
      nodePos: {
        x: 0,
        y: 0
      },
      nodeSize: {
        width: 800,
        height: 400
      }
    };
  },
  mounted() {
    this.handleChange();
    const rect = this.$el.getBoundingClientRect();
    this.nodePos = {
      x: rect.width / 2 - this.nodeSize.width / 2,
      y: 150
    };
  },
  methods: {
    handleChange() {
      this.value && this.$store.dispatch("update_device_type", this.value);
      EventBus.$emit("reload-viewport");
    },
    handleShowThemeWindow() {
      this.showThemeWindow = !this.showThemeWindow;
    },
    clearViewportPage() {
      this.clearConfirmVisible = false;
      getViewportVueInstance().clearPage();
      EventBus.$emit("clear-viewport");
    },
    saveViewportPage() {
      getViewportVueInstance().savePage();
    }
  }
};
</script>
<style scoped lang="scss">
.top-bar {
  height: 100%;
  .logo {
    height: 100%;
    position: relative;
    float: left;
    width: 100px;
    margin-right: -100px;
    text-align: center;
    // background-color: #414146;
    .temporary {
      position: relative;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      width: 80px;
      margin-top: 2px;
      .txt {
        position: absolute;
        top: 0px;
        left: 10px;
        width: 65px;
        line-height: 14px;
        color: #ffffff;
        transform: rotate(-4deg);
        font-size: 18px;
        text-shadow: 2px 2px #333;
      }
    }
  }
  .function {
    float: right;
    width: 100%;
    height: 100%;
  }
  .el-col {
    height: 100%;
    padding: 0 8px;
    padding-top: 6px;
  }
  .title {
    color: #aaa;
    text-align: center;
    padding-top: 6px;
  }
}
</style>

