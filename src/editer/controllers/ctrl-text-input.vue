<template>
  <div class="ctrl-text-input">
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: ""
    };
  }
};
</script>
<style lang="scss" scoped>
.ctrl-text-input {
  height: 100%;
}
</style>

