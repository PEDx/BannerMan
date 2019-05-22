<template>
  <div class="right-panel">
    <attribute-bar title="组件">
      <div ref="compList" class="list" style="overflow: hidden">
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
        <div class="item">
          <el-button type="primary">主要按钮</el-button>
        </div>
      </div>
    </attribute-bar>
    <attribute-bar title="资源"></attribute-bar>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import attributeBar from "../../components/attributeBar";
export default {
  components: {
    "attribute-bar": attributeBar
  },
  mounted() {
    this.$nextTick(() => {
      new Sortable(this.$refs.compList, {
        group: {
          name: "shared",
          pull: "clone", // To clone: set pull to 'clone'
          put: false
        },
        sort: false,
        animation: 150
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.right-panel,
.list {
  height: 100%;
}
.item {
  float: left;
  // width: 30px;
  // height: 30px;
  // background-color: aquamarine;
  // margin-right: 5px;
}
</style>

