<template>
  <div class="instance" :id="instance.id">
    <div
      ref="self"
      :class="{mouseover,selected}"
      :style="{
        paddingLeft: depth * 15 + 'px'
      }"
      class="self selectable-item"
      @click.stop="select"
      @dblclick.stop="toggle"
      @mouseenter="enter"
      @mouseleave="leave"
    >
      <!-- Component tag -->
      <span class="content">
        <!-- arrow wrapper for better hit box -->
        <span v-if="instance.children.length" class="arrow-wrapper" @click.stop="toggle">
          <span :class="{ rotated: expanded }" class="arrow right" />
        </span>

        <!-- <span class="angle-bracket">&lt;</span> -->

        <span class="item-name">{{ displayName }}</span>

        <!-- <span v-if="componentHasKey" class="attr">
          <span class="attr-title">key</span>=
          <span class="attr-value">{{ instance.renderKey }}</span>
        </span>-->

        <!-- <span class="angle-bracket">&gt;</span> -->
      </span>
      <span
        v-if="instance.consoleId"
        v-tooltip="$t('ComponentInstance.consoleId.tooltip', { id: instance.consoleId })"
        class="info console"
      >= {{ instance.consoleId }}</span>
      <span
        v-if="instance.isRouterView"
        class="info router-view"
      >router-view{{ instance.matchedRouteSegment ? ': ' + instance.matchedRouteSegment : null }}</span>
      <span v-if="instance.isFragment" class="info fragment">fragment</span>
      <span v-if="instance.functional" class="info functional">functional</span>
      <span v-if="instance.inactive" class="info inactive">inactive</span>

      <span class="spacer" />
    </div>

    <div v-if="expanded">
      <component-instance
        v-for="child in sortedChildren"
        :key="child.id"
        :instance="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<script>
import { scrollIntoView } from "@/utils/index";
import EventBus from "@/bus";

export default {
  name: "ComponentInstance",

  props: {
    instance: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expand: true
    };
  },
  inject: ["tree"],
  computed: {
    expanded() {
      return !!this.expand;
    },

    selected() {
      return this.instance.id === this.tree.selectedId;
    },
    mouseover() {
      return this.instance.id === this.tree.mouseoverId;
    },

    sortedChildren() {
      return this.instance.children
    },

    displayName() {
      return this.instance.name;
    },

    componentHasKey() {
      return (
        (this.instance.renderKey === 0 || !!this.instance.renderKey) &&
        this.instance.renderKey !== undefined
      );
    }
  },
  created() {
    // if (this.depth === 0) {
    // }
    this.expand = false;
    this.toggleWithValue(this.expand);
  },

  methods: {
    toggle(event) {
      this.toggleWithValue(!this.expanded, event.altKey);
    },

    collapse() {
      this.toggleWithValue(false);
    },

    toggleWithValue(val, recursive = false) {
      this.expand = !this.expand;
    },

    select() {
      EventBus.$emit("tree-select-instance", this.instance.id);
      this.tree.mouseoverId = null;
    },

    enter() {
      EventBus.$emit("tree-enter-instance", this.instance.id);
      this.tree.mouseoverId = this.instance.id;
    },

    leave() {
      // bridge.send("leave-instance", this.instance.id);
    },

    scrollToInstance() {
      // bridge.send("scroll-to-instance", this.instance.id);
    },

    scrollIntoView(center = true) {
      this.$nextTick(() => {
        scrollIntoView(this.$globalRefs.leftScroll, this.$refs.self, center);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.instance {
  font-family: dejavu sans mono, monospace;
  transition: all 0.3s;
  .platform-mac & {
    font-family: Menlo, monospace;
  }

  .platform-windows & {
    font-family: Consolas, Lucida Console, Courier New, monospace;
  }

  &.inactive {
    opacity: 0.5;
  }

  &:hover {
    background-color: #25252577;
  }
  &:active {
    outline: 0;
  }
  .mouseover {
    background-color: #25252577;
  }
  .selected {
    outline: 1px dashed rgb(255, 85, 0);
  }
}

.self {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 2;
  border-radius: 3px;
  // font-size: 14px;
  line-height: 22px;
  height: 22px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  padding-right: 6px;
  transition: font-size 0.15s, height 0.15s;

  &:hidden {
    display: none;
  }

  .high-density & {
    font-size: 12px;
    height: 15px;
  }
}

.children {
  position: relative;
  z-index: 1;
}

.content {
  position: relative;
  padding-left: 22px;
}

.info {
  color: #fff;
  font-size: 10px;
  padding: 3px 5px 2px;
  display: inline-block;
  line-height: 10px;
  border-radius: 3px;
  position: relative;
  top: -1px;

  .high-density & {
    padding: 1px 4px 0;
    top: 0;
  }

  &.console {
    color: #fff;
    background-color: transparent;
    top: 0;
  }

  &.router-view {
    background-color: #ff8344;
  }

  &.fragment {
    background-color: #b3cbf7;
  }

  &.inactive {
    background-color: #aaa;
  }

  &.functional {
    background-color: rgba(#333, 0.06);
    color: rgba(#333, 0.5);

    .vue-ui-dark-mode & {
      background-color: rgba(#fff, 0.06);
      color: rgba(#fff, 0.5);
    }
  }

  &:not(.console) {
    margin-left: 6px;
  }
}

.arrow-wrapper {
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 16px;
  top: 1px;
  left: 4px;
}

.arrow {
  position: absolute;
  top: 5px;
  left: 4px;
  transition: transform 0.1s ease;

  &.rotated {
    transform: rotate(90deg);
  }
}

.angle-bracket {
  color: #ccc;
}

.item-name {
  margin: 0 1px;
}

.spacer {
  flex: auto 1 1;
}

.icon-button {
  width: 16px;
  height: 16px;
}
</style>
