<template>
  <div class="faq">
    <div class="content">
      <div v-for="(val, idx) in qlist" :key="idx" class="item">
        <div class="item-title border-line-1px">{{ val.title }}</div>
        <span :class="['arrow', val.roll && 'down-arrow']"></span>
        <transition name="slideInDown" mode="out-in">
          <p v-show="val.roll" class="item-content border-line-1px">{{ val.content }}</p>
        </transition>
      </div>
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
    rollUp(event) {
      event.val.roll = !event.val.roll;
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
  padding-top: 10px;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  .content {
    min-height: 2.666667rem;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 0;
    padding-bottom: 1.6rem;
  }
  .item {
    position: relative;
    box-sizing: border-box;
    margin-left: 0.4rem;
    overflow: hidden;
    .item-title {
      position: relative;
      z-index: 9;
      line-height: 1.12rem;
      // border-bottom: 1px solid #eee;
      // height: 1.12rem;
      background-color: #fff;
      box-sizing: border-box;
      padding-right: 0.666667rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .arrow {
      position: absolute;
      z-index: 99;
      right: 0.4rem;
      top: 0.32rem;
      width: 0.25rem;
      height: 0.5rem;
      background-position: -0.666667rem 0px;
      // background-image: url("../../assets/icon_group.png");
      background-repeat: no-repeat;
      background-size: 0.96rem 1.12rem;
      transform: rotateZ(180deg);
      transform-origin: 50% 50%;
      transition: 0.3s all;
    }
    .down-arrow {
      transform: rotateZ(270deg);
    }
    .item-content {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      padding: 0.266667rem 0;
      padding-right: 0.266667rem;
    }
  }
}
</style>
