<template>
  <div :class="{'high-density': false,'tree': true}">
    <component-instance
      v-for="instance in instances"
      ref="instances"
      :key="instance.id"
      :instance="instance"
      :depth="0"
    />
  </div>
</template>

<script>
import ComponentInstance from "./component-instance";

export default {
  components: {
    ComponentInstance
  },
  props: {
    instances: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      selecting: false,
      mouseoverId: null,
      selectedId: null,
      highDensity: false
    };
  },
  provide() {
    return {
      tree: this
    };
  },
  mounted() {
    window.addEventListener(
      "message",
      e => {
        if (e.data.type !== "element-mouseover") return;
        this.mouseoverId = e.data.id;
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        if (e.data.type !== "select-component") return;
        this.mouseoverId = null;
        this.selectedId = e.data.id;
      },
      false
    );
  },

  beforeDestroy() {
    this.setSelecting(false);
    // bridge.off("instance-selected", this.stopSelector);
    // bridge.off("stop-selector", this.stopSelector);
  },

  methods: {
    stopSelector() {
      this.setSelecting(false);
    },

    filterInstances(e) {
      // bridge.send("filter-instances", classify(e.target.value));
    },

    setSelecting(value) {
      if (this.selecting !== value) {
        this.selecting = value;

        if (this.selecting) {
          // bridge.send("start-component-selector");
        } else {
          // bridge.send("stop-component-selector");
        }
      }
    }
  }
};

const isComponentInstance = object =>
  typeof object !== "undefined" && typeof object.instance !== "undefined";

const getAllInstances = list =>
  list.reduce((instances, i) => {
    if (isComponentInstance(i)) {
      instances.push(i);
    }
    instances = instances.concat(getAllInstances(i.$children));
    return instances;
  }, []);
</script>

<style lang="scss">
@import "./color.scss";
.tree {
  padding: 5px;
}

.select-component {
  &.active {
    color: $active-color;

    .vue-ui-icon {
      animation: pulse 2s infinite linear;
    }
  }
}
</style>
