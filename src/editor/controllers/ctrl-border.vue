<template>
  <div class="ctrl-border">
    <div class="left">
      <el-input-number
        v-model="width"
        @change="handleChange"
        controls-position="right"
        :min="0"
        :max="400"
      ></el-input-number>
    </div>
    <div class="right">
      <el-color-picker v-model="color" show-alpha color-format="rgb"></el-color-picker>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: () => ({}),
      type: Object
    }
  },
  data() {
    return {
      color: "#fff",
      width: 0
    };
  },
  watch: {
    color() {
      this.$emit("submit-update", {
        width: this.width,
        color: this.color
      });
    },
    width() {
      this.$emit("submit-update", {
        width: this.width,
        color: this.color
      });
    }
  },
  created() {
    this.color = this.value.color;
    this.width = this.value.width || 0;
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-border {
  .left {
    float: left;
    padding-top: 4px;
  }
  .right {
    margin-left: 10px;
    float: left;
  }
}
</style>

