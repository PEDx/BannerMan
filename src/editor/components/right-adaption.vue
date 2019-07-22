<template>
  <div class="right-adaption g-bd1 f-cb">
    <div class="g-sd1 content">
      <slot name="left" />
    </div>
    <div class="g-mn1">
      <div class="g-mn1c content">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.right-adaption {
  height: 100%;
  .g-bd1 {
    margin: 0 0 10px;
  }
  .g-sd1 {
    position: relative;
    float: left;
    width: 180px;
    height: 100%;
    margin-right: -180px;
    overflow: auto;
    background-color: #343438;
  }
  .g-mn1 {
    height: 100%;
    float: right;
    width: 100%;
  }
  .g-mn1c {
    height: 100%;
    margin-left: 186px;
    overflow: auto;
    background-color: #343438;
  }
  .content {
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

