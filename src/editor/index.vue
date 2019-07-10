<template>
  <div class="layout">
    <div class="top">
      <top-bar />
    </div>
    <div class="content">
      <container />
    </div>
    <div class="bottom">
      <bottom-bar />
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import container from "./container/index";
import topBar from "./topBar";
import bottomBar from "./bottomBar";
export default {
  components: {
    container,
    bottomBar,
    topBar
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  padding-top: 32px;
  padding-bottom: 20px;
  box-sizing: border-box;
  .top {
    position: absolute;
    top: 0;
    height: 32px;
    width: 100%;
    background-color: #343438;
    border-bottom: 1px solid #262629;
    box-sizing: border-box;
  }
  .content {
    height: 100%;
  }
  .bottom {
    position: absolute;
    bottom: 0;
    height: 20px;
    width: 100%;
    background-color: #343438;
    border-top: 1px solid #262629;
    box-sizing: border-box;
  }
}
</style>
