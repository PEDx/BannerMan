<template>
  <img src="../assets/img/cont.png" alt>
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
    };
  },
  created() {},
  methods: {
    leftClickEvent() {
      console.log("leftClickEvent");
    },
    rollUp(val) {
      val.roll = !val.roll;
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  display: inline-block;
  width: 100%;
}
</style>
