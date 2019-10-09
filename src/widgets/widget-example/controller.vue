<template>
  <div class="custom" @click="handleClick">custom</div>
</template>
<script>
export default {
  props: {
    value: Number
  },
  data() {
    return {
      number: this.value
    };
  },
  methods: {
    handleClick() {
      this.$emit("submit-update", ++this.number);
    }
  }
};
</script>

<style lang="scss" scoped>
.custom {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  border: 1px dashed #fd9527;
  cursor: pointer;
}
</style>

