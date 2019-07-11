<template>
  <div class="ctrl-rich-text">
    <el-button type="primary" icon="el-icon-edit-outline" circle @click="handleShow"></el-button>
    <float-window :show.sync="showWindow" :position="nodePos"></float-window>
  </div>
</template>
<script>
import floatWindow from "../components/float-window";
export default {
  components: {
    floatWindow
  },
  props: {
    value: String
  },

  data() {
    return {
      input: "",
      showWindow: false,
      nodePos: {
        x: 0,
        y: 0
      }
    };
  },
  watch: {
    input() {
      this.$emit("submit-update", this.input);
    }
  },
  mounted() {
    const rect = this.$el.getBoundingClientRect();
    this.nodePos = {
      x: rect.x - 440,
      y: rect.y - 250
    };
  },
  methods: {
    handleShow() {
      this.showWindow = !this.showWindow;
    },
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-rich-text {
  height: 100%;
}
</style>

