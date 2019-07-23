<template>
  <div class="ctrl-resource-drop">
    <el-tooltip
      class="item"
      effect="dark"
      content="请从左侧拖动资源到此"
      placement="bottom"
      :disabled="droped"
    >
      <div class="drop-container" :class="{'drop-container': true, draging, droped}">
        <div
          class="preview"
          :style="{backgroundImage: resource && `url(${resource.url})`, backgroundPositionY: '30%', backgroundSize: '100%'}"
        ></div>
        <i class="el-icon-plus" v-show="!droped"></i>
        <el-button
          type="info"
          round
          icon="el-icon-delete"
          style="padding: 4px 5px;position: relative;z-index: 2;"
          @click.native.stop="handleClick"
          v-show="droped"
        ></el-button>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
import EventBus from "../../bus";
export default {
  props: {
    value: Object
  },
  data() {
    return {
      input: "",
      disabledTooltop: false,
      draging: false,
      droped: false,
      resource: null
    };
  },
  watch: {
    resource() {
      this.$emit("submit-update", this.resource);
    }
  },
  mounted() {
    if (this.value) {
      this.resource = this.value;
      this.droped = true;
    }
    EventBus.$on("resource-dragend", () => {
      this.draging = false;
    });
    this.$el.addEventListener("dragenter", e => {
      e.preventDefault();
      console.log("dragenter");
      this.draging = true;
    });
    this.$el.addEventListener("dragover", e => {
      e.preventDefault();
    });
    this.$el.addEventListener("drop", e => {
      const type = e.dataTransfer.getData("RESOURCE_TYPE");
      const file = e.dataTransfer.getData("RESOURCE_FILE");
      if (type) {
        this.droped = true;
        this.resource = JSON.parse(file);
        this.resourceType = type;
      }
    });
  },
  methods: {
    handleChange() {},
    clearRes() {},
    handleClick() {
      this.droped = false;
      this.resource = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.ctrl-resource-drop {
  .drop-container {
    position: relative;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    border: 1px dashed #898989;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      background-color: #89898918;
    }
    .preview {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      filter: blur(5px);
    }
  }
  .draging {
    border: 1px dashed #fd9527;
  }
  .droped {
    border: 1px dashed #fd9527;
  }
}
</style>

