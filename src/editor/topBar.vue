<template>
  <div class="topBar">
    <el-row style="height: 100%;">
      <el-col :span="8">s</el-col>
      <el-col :span="8" style="textAlign: center;height: 100%;paddingTop: 6px;">
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
      </el-col>
      <el-col :span="8">s</el-col>
    </el-row>
  </div>
</template>
<script>
import deviceModelList from './device'
export default {
  data() {
    return {
      options: deviceModelList,
      value: ""
    };
  }
};
</script>
<style scoped>
.topBar {
  height: 100%;
}
</style>

