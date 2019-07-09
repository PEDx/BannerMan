<template>
  <div id="sortble-container">
    <slot />
    <sortble-item
      :element-mixin-index="value.length"
      :element-mixin-is-placeholder="true"
      style="position: absolute; top: 0px;left: 0;width: 100%;display: none;"
    >
      <div
        style="width: 100%;height: 80px;line-height: 80px;text-align: center;box-sizing: border-box;background-color: rgba(166, 160, 183, 0.16);"
      >
        <i class="el-icon-plus" style="color: #bbb2a8;font-size: 34px;">+</i>
      </div>
    </sortble-item>
  </div>
</template>
<script>
import { ContainerMixin, SlickItem } from "../sortble";
export default {
  components: {
    "sortble-item": SlickItem
  },
  mixins: [ContainerMixin]
};
</script>

