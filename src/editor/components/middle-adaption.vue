<template>
  <div class="middle-adaption g-bd5 f-cb">
    <div class="g-sd51 content">
      <slot name="left" />
    </div>
    <div class="g-mn5">
      <div class="g-mn5c content">
        <slot name="middle" />
      </div>
    </div>
    <div class="g-sd52 content">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
// 三列中间自适应布局
export default {};
</script>

<style lang="scss" scoped>
.middle-adaption {
  height: 100%;
  margin: 0 0 10px;
  .g-sd51,
  .g-sd52 {
    position: relative;
    float: left;
    width: 180px;
    margin: 0 -180px 0 0;
    box-sizing: border-box;
    border-right: 1px solid #313134;
  }
  .g-sd52 {
    float: right;
    width: 220px;
    margin: 0 0 0 -220px;
    border-left: 1px solid #313134;
  }
  .g-mn5 {
    float: left;
    width: 100%;
    height: 100%;
  }
  .g-mn5c {
    margin: 0 220px 0 180px;
  }
  .content {
    height: 100%;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      background: #343438;
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: lighten(#343438, 7%);
      border-radius: 2px;
    }
    &::-webkit-scrollbar {
      width: 5px;
      height: 0;

      &-thumb {
        background: #7f7c87;
      }
    }
  }
}
</style>

