<template>
  <div class="top-bar">
    <div class="logo">
      <div class="temporary">
        <logo/>
        <h1 class="txt">Banner Man</h1>
      </div>
    </div>
    <div class="function">
      <el-row style="height: 100%;">
        <el-col :span="8"></el-col>
        <el-col :span="8" style="text-align: center;">
          <el-select
            v-model="value"
            placeholder="请选择"
            style="width: 210px;"
            @change="handleChange"
          >
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
          <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px;">页面信息配置</el-button>
        </el-col>
        <el-col :span="8" style="text-align: right;">
          <el-button
            type="primary"
            icon="el-icon-delete-solid"
            style="margin-left: 10px;"
            class="danger"
          >清空</el-button>
          <el-button type="primary" icon="el-icon-mobile-phone" style="margin-left: 10px;">预览</el-button>
          <el-button type="primary" icon="el-icon-document-checked">保存</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import deviceModelList from "./device";
import EventBus from "../bus";
import logo from "./logo";
export default {
  components: { logo },
  data() {
    return {
      options: deviceModelList,
      value: this.$store.state.editerSetting.deviceType || "iphone6"
    };
  },
  mounted() {
    this.handleChange();
  },
  methods: {
    handleChange() {
      this.value && this.$store.dispatch("update_device_type", this.value);
      EventBus.$emit("reload-viewport");
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
  .el-row {
    // margin-left: 100px;
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

