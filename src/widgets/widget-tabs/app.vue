<template>
  <div class="widget-tabs">
  </div>
</template>
<script>

export default {
  props: {
    width: {
      default: 100,
      type: Number
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    handleClick() {}
  }
};
</script>
<style lang="scss" scoped>
.widget-tabs {
  box-sizing: border-box;
  padding: 0 10px;
}
</style>

