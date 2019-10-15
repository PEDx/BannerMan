<template>
  <div class="ctrl-resource-drop">
    <div class="color item">
      <el-color-picker v-model="color" show-alpha color-format="rgb"></el-color-picker>
    </div>
    <div class="res item">
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
          <el-cascader
            v-show="droped"
            v-model="mode"
            :options="options"
            @change="handleChange"
            placeholder="请选择显示模式"
          ></el-cascader>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import EventBus from "@/bus";
export default {
  props: {
    value: Object
  },
  data() {
    this.options = [
      {
        value: "scroll",
        label: "跟随内容滚动",
        children: [
          {
            value: "full",
            label: "铺满"
          },
          {
            value: "repeat",
            label: "重复"
          }
        ]
      },

      {
        value: "fixed",
        label: "不跟随内容滚动",
        children: [
          {
            value: "full",
            label: "铺满"
          },
          {
            value: "repeat",
            label: "重复"
          }
        ]
      }
    ];
    return {
      color: "#fff",
      disabledTooltop: false,
      draging: false,
      droped: false,
      resource: {},
      mode: []
    };
  },
  watch: {
    resource: {
      deep: true,
      handler: function() {
        this.$emit("submit-update", this.resource);
      }
    },
    color() {
      this.resource.color = this.color;
      this.$emit("submit-update", this.resource);
    }
  },
  created() {
    this.resource = this.value;
    this.color = this.resource.color;
    if (this.resource.url) {
      this.mode = [this.resource.imgMode];
      if (this.resource.imgSize === "100% 100%") {
        this.mode[1] = "full";
      } else {
        this.mode[1] = "repeat";
      }
      this.droped = true;
    }
  },
  mounted() {
    EventBus.$on("resource-dragend", () => {
      this.draging = false;
    });
    this.$el.addEventListener("dragenter", e => {
      e.preventDefault();
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
        this.resource.url = JSON.parse(file).url;
        this.resourceType = type;
      }
    });
  },
  methods: {
    handleChange() {
      if (this.mode[1] === "full") {
        this.resource.imgRepeat = "no-repeat";
        this.resource.imgSize = "100% 100%";
      } else {
        this.resource.imgRepeat = "repeat";
        this.resource.imgSize = "";
      }
      // debugger;
      this.resource.imgMode = this.mode[0];
      this.$emit("submit-update", this.resource);
    },
    clearRes() {},
    handleClick() {
      this.droped = false;
      this.resource.url = "";
    }
    // handleChange() {
    //   this.resource.imgSize = "100% 100%";
    //   this.resource.imgRepeat = "no-repeat";
    //   this.$emit("submit-update", this.resource);
    // }
  }
};
</script>
<style lang="scss" scoped>
.ctrl-resource-drop {
  .color {
    float: left;
    margin-right: 8px;
  }
  .drop-container {
    position: relative;
    height: 28px;
    line-height: 28px;
    border-radius: 4px;
    border: 1px dashed #898989;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    box-sizing: border-box;
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

