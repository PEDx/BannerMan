<template>
  <div class="sortble-item">
    <slot/>
  </div>
</template>
<script>
import { ElementMixin } from "vue-slicksort";
export default {
  name: "SortbleItem",
  mixins: [ElementMixin]
};
</script>
