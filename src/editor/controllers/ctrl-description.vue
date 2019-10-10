<template>
  <div class="ctrl-description" v-html="setting.description"></div>
</template>
<script>
// 纯描述展示
export default {
  props: {
    setting: Object
  }
};
</script>
<style lang="scss" scoped>
.ctrl-description {
  height: 100%;
  box-sizing: border-box;
  padding: 6px;
  color: #7f7c87;
}
</style>

