<template>
  <div class="right-panel">
    <fold-bar title="属性">
      <el-input-number v-model="num" @change="handleChange" :min="0" :max="400" label="描述文字"></el-input-number>
    </fold-bar>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
export default {
  components: {
    "fold-bar": foldBar
  },
  data() {
    return {
      num: 200
    };
  },
  mounted() {},
  methods: {
    handleChange() {
      const iframeWindow = window.frames.viewport;
      console.log(iframeWindow._CURRENT_SELECTED_VUE_WIDGET_INSTANCE_._profile_);
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
}
</style>

