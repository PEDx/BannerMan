<template>
  <scroll-pane>
    <div slot="scroll" :class="{'high-density': false,'tree': true}">
      <component-instance
        v-for="instance in instances"
        ref="instances"
        :key="instance.id"
        :instance="instance"
        :depth="0"
      />
    </div>
  </scroll-pane>
</template>

<script>
import ScrollPane from "./scroll-pane";
import ComponentInstance from "./component-instance";

export default {
  components: {
    ScrollPane,
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
      highDensity: false
    };
  },

  mounted() {
    // bridge.on("instance-selected", this.stopSelector);
    // bridge.on("stop-component-selector", this.stopSelector);
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
