<template>
  <div class="scroll-pane">
    <div class="header">
      <slot name="header"/>
    </div>
    <div class="scroll">
      <slot name="scroll"/>
    </div>
    <div v-if="$slots.footer" class="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "./tree/color.scss";
.scroll-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll {
  flex: 1;
  overflow: auto;
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

.scroll--themed {
  &::-webkit-scrollbar {
    width: 12px;
    height: 0;

    &-thumb {
      background: #7f7c87;
    }
  }
}

.footer {
  border-top: 1px solid $border-color;

  .vue-ui-dark-mode & {
    border-top-color: $dark-border-color;
  }
}
</style>
