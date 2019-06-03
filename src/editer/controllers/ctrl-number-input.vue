<template>
  <div class="ctrl-number-input">
    <el-input-number v-model="num" @change="handleChange" controls-position="right" :min="0" :max="400" label="描述文字"></el-input-number>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 200
    };
  },
  mounted() {},
  methods: {
    handleChange() {
    }
  }
};
</script>
<style lang="scss" scoped>
.ctrl-number-input {
  height: 100%;
}
</style>

