<template>
  <div class="topBar">
    <el-row style="height: 100%;">
      <el-col :span="8">
        <el-select v-model="value" placeholder="请选择">
          <template slot="prefix">
            <i class="el-icon-mobile-phone"></i>
          </template>
          <el-option
            v-for="item in options"
            :key="item.desc"
            :label="`${item.desc} / (${item.resolution.width}x${item.resolution.height})`"
            :value="item.desc"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px;">页面信息配置</el-button>
      </el-col>
      <el-col :span="8">
        <!-- <div class="title">情人节活动</div> -->
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-button type="primary" icon="el-icon-view" style="margin-left: 10px;">预览</el-button>
        <el-button type="primary" icon="el-icon-document-checked">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import deviceModelList from "./device";
export default {
  data() {
    return {
      options: deviceModelList,
      value: ""
    };
  }
};
</script>
<style scoped lang="scss">
.topBar {
  height: 100%;

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

