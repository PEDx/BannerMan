<template>
  <div class="faq">
    <div class="content">
      <img src="../assets/img/cont.png" alt>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content",
  data() {
    return {
      qlist: [
        {
          title: "题目",
          content: "爱上都会覅都会发iOS地方好似东方红",
          roll: false
        },
        {
          title: "题目",
          content: "爱上都会覅都会发iOS地方好似东方红",
          roll: false
        },
        {
          title: "题目",
          content: "爱上都会覅都会发iOS地方好似东方红",
          roll: false
        },
        {
          title: "题目",
          content: "爱上都会覅都会发iOS地方好似东方红",
          roll: false
        }
      ]
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

<style lang="scss">
.faq {
  position: relative;
  height: 100%;
  background-color: #f8f8f8;
  font-size: 0.373333rem;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  .content {
    min-height: 2.666667rem;
    background-color: #fff;
    box-sizing: border-box;
    img {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
