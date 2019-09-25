<template>
  <div class="sort-element">
    <slot />
  </div>
</template>
<script>
import { SortElementMixin } from "./SortElementMixin";
export default {
  mixins: [SortElementMixin]
};
</script>

<style lang="scss" scoped>
.sort-element {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  outline: 1px solid #666;
  color: #666;
  cursor: pointer;
  user-select: none;
}
</style>

