<template>
  <div
    class="widget-container"
    :style="{
      width: '100%',
      height: heightModel === 'px' ? `${size[1]}px` : heightModel,
      ...(backgroundObj.imgMode !== 'scroll' ? {
        backgroundColor: backgroundObj.color,
        backgroundImage: backgroundObj.url ? `url(${backgroundObj.url})` : '',
        backgroundRepeat: backgroundObj.imgRepeat,
        backgroundSize: backgroundObj.imgSize,
      } : {}),
      position: positionModel,
      bottom: `${position[0]}px`,
      left: `${position[1]}px`,
    }"
  >
    <template v-if="inEditor">
      <sort-container
        ref="sortbleContainer"
        :bm-sort-container-data="childComponentsModel"
        :bm-sort-container-height="'100%'"
        :bm-sort-container-handle="true"
        @sort-start="_handleSortStart"
        @sort-end="_handleSortEnd"
        @drag-start="_handleDragStart"
        @insert-start="_handleInsertStart"
        @insert-end="_handleInsertEnd"
      >
        <div
          class="bg-box"
          :style="backgroundObj.imgMode === 'scroll' ? {
            backgroundColor: backgroundObj.color,
            backgroundImage: backgroundObj.url ? `url(${backgroundObj.url})` : '',
            backgroundRepeat: backgroundObj.imgRepeat,
            backgroundSize: backgroundObj.imgSize,
          } : {}"
        >
          <slot />
        </div>
      </sort-container>
    </template>
    <template v-else>
      <div
        class="container"
        :style="{
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }"
      >
        <div
          class="container-wrap"
          :style="{
            position: 'relative',
            height: '100%',
            overflow: 'auto'
          }"
        >
          <div class="container-scroll-container">
            <div
              class="bg-box"
              :style="backgroundObj.imgMode === 'scroll' ? {
                backgroundColor: backgroundObj.color,
                backgroundImage: backgroundObj.url ? `url(${backgroundObj.url})` : '',
                backgroundRepeat: backgroundObj.imgRepeat,
                backgroundSize: backgroundObj.imgSize,
              } : {}"
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
const _BM_EDIT_RUNTIME_ = !!window._BM_EDIT_RUNTIME_;
export default {
  mixins: [_BM_EDIT_RUNTIME_ ? window._BM_WIDGET_CONTAINER_MIXIN_ : ""],
  props: {
    size: {
      default: () => [100, 300],
      type: Array
    },
    backgroundObj: {
      type: Object,
      default: () => ({
        color: "#fff"
      })
    },
    heightModel: {
      default: "px",
      type: String
    },
    positionModel: {
      default: "static",
      type: String
    },
    position: {
      default: () => [0, 0],
      type: Array
    },
    zIndex: {
      default: 9,
      type: Number
    }
  },
  data() {
    return {
      inEditor: _BM_EDIT_RUNTIME_
    };
  },
  watch: {
    positionModel: {
      handler: function(nv) {
        this.$emit("activee-widget-sort");
        if (nv === "absolute" || nv === "fixed") {
          this.$emit("disable-widget-sort");
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$el._BM_CONTAINER_ = true;
  }
};
</script>
<style lang="scss" scoped>
.widget-container {
  // box-shadow: inset 0px 5px 5px -5px #000, inset 0px -5px 5px -5px #000;
  position: relative;
  box-sizing: border-box;
}
</style>

