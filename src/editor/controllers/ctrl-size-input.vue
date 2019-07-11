<template>
  <div class="ctrl-size-input">
    <div class="item">
      <span class="text">宽</span><el-input-number
        v-model="width"
        @change="handleChange"
        controls-position="right"
        :min="0"
        :max="400"
      ></el-input-number>
    </div>
    <div class="item">
      <span class="text">高</span><el-input-number
        v-model="height"
        @change="handleChange"
        controls-position="right"
        :min="0"
        :max="400"
      ></el-input-number>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: Array
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  watch: {
    color() {
      this.$emit("submit-update", this.color);
    }
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-size-input {
  height: 100%;
  .item {
    display: inline-block;
  }
  .text {
    padding: 0 4px;
  }
}
</style>

