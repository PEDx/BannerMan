<template>
  <div class="ctrl-emit-event">
    <p v-for="(val, idx) in value" :key="idx">{{ idx + 1 }}. {{ val }}</p>
  </div>
</template>
<script>
// 纯描述展示
export default {
  props: {
    value: Array
  }
};
</script>
<style lang="scss" scoped>
.ctrl-emit-event {
  height: 100%;
  box-sizing: border-box;
  padding: 6px;
  color: #7f7c87;
}
</style>
