<template>
  <div class="sortble-container">
    <slot/>
  </div>
</template>
<script>
import { ContainerMixin } from "vue-slicksort";
export default {
  name: "SortbleList",
  mixins: [ContainerMixin]
};
</script>
