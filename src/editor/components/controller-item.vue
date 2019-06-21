<template>
  <div class="controller-item">
    <div class="label f-toe">
      <slot name="label"></slot>
    </div>
    <div class="ctrl">
      <div class="ctrl-box">
        <slot name="ctrl"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.controller-item {
  overflow: hidden;
  padding: 6px 0;
  padding-right: 8px;
  display: flex;
  align-items: center;
  .label {
    float: left;
    width: 120px;
    margin-right: -120px;
    text-align: right;
    box-sizing: border-box;
    padding-right: 12px;
    padding-left: 8px;
  }
  .ctrl {
    float: right;
    width: 100%;
    .ctrl-box {
      margin-left: 120px;
    }
  }
}
</style>

