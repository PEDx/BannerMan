<template>
  <div class="components-wrap">
    <div
      v-for="(item, idx) in components"
      :key="item.id"
      :class="{
        'selected': selectedId === item.id,
        'component-item': true
      }"
    >
      <component
        :id="item.id"
        :is="item.name"
        :ref="item.id"
        :bm-sort-element-mixin-index="idx"
        :bm-sort-element-mixin-disabled="isMultContainer"
        :child-components-model="item.children"
        :child-deep-level="level"
        @widget-event="rootContainer._handleWidgetEvent(...arguments, item.id)"
        @contianer-sort-start="rootContainer._handleSortStart"
        @contianer-sort-end="rootContainer._handleSortEnd"
        @contianer-insert-end="rootContainer._handleInsertEnd"
        @contianer-insert-start="rootContainer._handleInsertStart"
        @contianer-drag-start="rootContainer._handleDragStart"
        @tabs-count-changed="rootContainer._tabsCountChanged(...arguments, item.id)"
        v-bind="item.props"
      >
        <template v-if="rootContainer.getWidgetProfileByName(item.name).multContainer">
          <components-wrap
            v-for="(val, idx) in item.children"
            :key="idx"
            :slot="`slot_${idx}`"
            :components="[val]"
            :level="deep_index"
            :is-mult-container="true"
          ></components-wrap>
        </template>
        <template v-else>
          <components-wrap
            v-if="item.children && item.children.length > 0"
            :components="item.children"
            :level="deep_index"
          ></components-wrap>
        </template>
      </component>
    </div>
  </div>
</template>
<script>
// const emitEventsMap = {}
// const onEventsMap = {}
// 由 components-wrap 来展开子元素数组
export default {
  props: {
    components: {
      type: Array,
      default: () => []
    },
    level: {
      type: Number,
      default: 0
    },
    isMultContainer: {
      // 是否是包含多容器的包装容器
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deep_index: this.level + 1,
      selectedOverlay: null
    };
  },
  inject: ["rootContainer"],
  computed: {
    selectedId() {
      return this.rootContainer.selectedId;
    },
    haveSelectedId() {
      let bol = false;
      this.components.forEach(val => {
        if (val.id === this.selectedId) bol = true;
      });
      return bol;
    }
  },
  watch: {
    selectedId: function(nv, ov) {
      if (ov === nv) return;
      this.hideOverlay();
      if (this.haveSelectedId) this.showSelectedOverlay(nv);
    }
  },
  mounted() {
    // console.log(this.components);
  },
  methods: {
    getSelectedOverlay() {
      if (this.selectedOverlay) {
        return this.selectedOverlay;
      }
      let selectedOverlay = (this.selectedOverlay = null);
      selectedOverlay = document.createElement("div");
      selectedOverlay.style.position = "absolute";
      selectedOverlay.style.zIndex = "9998";
      selectedOverlay.style.boxSizing = "border-box";
      selectedOverlay.style.border = "1px dashed #ff5500";
      selectedOverlay.style.pointerEvents = "none";
      selectedOverlay.style.alignItems = "center";
      selectedOverlay.style.justifyContent = "center";
      selectedOverlay.style.borderRadius = "3px";

      this.selectedOverlay = selectedOverlay;
      return selectedOverlay;
    },
    showSelectedOverlay(id) {
      const ins = this.rootContainer.componentInstanceMap[id];
      const rect = this.getInstanceOrVnodeRect(ins);
      const overlay = this.getSelectedOverlay();
      overlay.style.display = "block";
      overlay.style.width = ~~rect.width + "px";
      overlay.style.height = ~~rect.height + "px";
      overlay.style.top = ~~rect.top + "px";
      overlay.style.left = 0 + "px";
      if (!overlay.parentNode) {
        this.$el.appendChild(overlay);
      }
    },
    hideOverlay() {
      if (this.selectedOverlay) {
        this.selectedOverlay.style.display = "none";
      }
    },
    getInstanceOrVnodeRect(instance) {
      const el = instance.$el || instance.elm;
      const rect = el.getBoundingClientRect();
      return {
        width: el.clientWidth,
        height: rect.height,
        top: el.offsetTop,
        left: el.offsetLeft
      };
    },
    refreshOverlay() {
      this.showSelectedOverlay(this.selectedId);
    }
  }
};
</script>

<style lang="scss" scoped>
.selected {
  box-sizing: border-box;
  .sort-container-mark {
    display: block !important;
  }
  // border: 1px dashed #ff5500;
}
</style>
