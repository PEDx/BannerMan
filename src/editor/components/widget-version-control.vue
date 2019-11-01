<template>
  <div class="widget-version-control">
    <div class="btn">
      <el-switch
        v-model="value"
        active-color="#fd9527"
        inactive-color="#898989"
        inactive-text="显示全部挂件"
      ></el-switch>
      <el-popover placement="top" width="160" v-model="clearConfirmVisible">
        <p>确认更新全部组件？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="clearConfirmVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="confirmUpdateAll">确定</el-button>
        </div>
        <el-button slot="reference" type="primary" icon="el-icon-warning" style="float: right">更新全部</el-button>
      </el-popover>
    </div>
    <ul>
      <li v-for="(v, k) in version" :key="k" class="item">
        <span class="name">{{ k }}</span>
        <span class="version">[{{ v }}]</span>
        <el-button
          :type="compareVersion(v,new_version_widget_map[k]) >= 0 ? 'primary' : 'success'"
          :disabled="compareVersion(v,new_version_widget_map[k]) >= 0"
          icon="el-icon-cloudy"
          @click="handleUpdate(k)"
          class="new-version"
        >{{ new_version_widget_map[k] }}</el-button>
      </li>
    </ul>
  </div>
</template>
<script>
import { compareVersion } from "@utils/index";
export default {
  props: {
    newVersion: {
      default: () => [],
      type: Array
    },
    version: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      clearConfirmVisible: false,
      value: false
    };
  },
  computed: {
    new_version_widget_map() {
      const _obj = {};
      this.newVersion.forEach(val => {
        _obj[val.name] = val.version;
      });
      return _obj;
    }
  },
  created() {},
  methods: {
    compareVersion,
    confirmUpdateAll() {
      this.clearConfirmVisible = false;
      this.$emit("update-version", []);
    },
    handleUpdate(name) {
      this.$emit("update-version", [name]);
    }
  }
};
</script>

<style lang="scss" scoped>
.widget-version-control {
  padding: 8px;
  height: 100%;
  font-size: 12px;
  .btn {
    padding-bottom: 10px;
    border-bottom: 1px solid #343438;
  }
  .item {
    padding: 12px 0;
  }
  .version {
    color: #999;
  }
  .new-version {
    float: right;
  }
}
</style>

