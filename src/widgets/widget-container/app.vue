<template>
  <div
    class="widget-container"
    :style="{
      height: heightModel === 'px' ? `${height}px` : heightModel,
      ...(bgImg.imgMode !== 'scroll' ? {
        background: bgImg.url ? `url(${bgImg.url}) ${bgImg.imgRepeat || ''}` : bgColor,
        backgroundSize: bgImg.imgSize || ''
      } : {})
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
          :style="bgImg.imgMode === 'scroll' ? {
            background: bgImg.url ? `url(${bgImg.url}) ${bgImg.imgRepeat || ''}` : bgColor,
            backgroundSize: bgImg.imgSize || ''
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
              :style="bgImg.imgMode === 'scroll' ? {
                background: bgImg.url ? `url(${bgImg.url}) ${bgImg.imgRepeat || ''}` : bgColor,
                backgroundSize: bgImg.imgSize || ''
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
    width: {
      default: 100,
      type: Number
    },
    bgColor: {
      type: String
    },
    bgImg: {
      type: Object,
      default: () => ({})
    },
    height: {
      default: 200,
      type: Number
    },
    heightModel: {
      default: "px",
      type: String
    }
  },
  data() {
    return {
      inEditor: _BM_EDIT_RUNTIME_
    };
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

