<template>
  <div ref="content" :style="{width: `${viewSize[0]}px`,height: `${viewSize[1]}px`}" class="viewport"></div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  props: {
    viewSize: {
      default: () => [375, 667],
      type: Array
    }
  },
  mounted() {
    this.$nextTick(() => {
      new Sortable(this.$refs.content, {
        group: "shared",
        animation: 150
      });
    });
  },
  methods: {
    reloadView() {}
  }
};
</script>

<style lang="scss" scoped>
.viewport {
  margin: 0 auto;
  background: #fff;
  overflow: auto;
  // margin-top: 30px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.42), 0 0 24px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
}
</style>

