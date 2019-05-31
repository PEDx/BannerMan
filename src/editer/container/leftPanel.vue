<template>
  <div class="right-panel">
    <fold-bar title="控件">
      <div
        v-for="(val, idx) in widgets"
        ref="groupBox"
        :key="idx"
        class="group"
        style="overflow: hidden"
      >
        <div class="group-title">{{ val.groupName }}</div>
        <div
          v-for="(item, index) in val.items"
          :key="index"
          :draggable="true"
          class="widget"
          style="overflow: hidden"
          @dragstart="handleDragstart"
        >
          <i :class="item.icon"></i>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </fold-bar>
    <fold-bar title="资源"></fold-bar>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
const widgets = [
  {
    group: "BASICS",
    groupName: "基础控件",
    items: [
      {
        name: "容器",
        widgetName: "List",
        widget: "",
        icon: "el-icon-c-scale-to-original"
      },
      {
        name: "图片",
        widgetName: "List",
        widget: "",
        icon: "el-icon-picture"
      },
      {
        name: "倒计时",
        widgetName: "List",
        widget: "",
        icon: "el-icon-timer"
      },
      {
        name: "按钮",
        widgetName: "List",
        widget: "",
        icon: "el-icon-aim"
      }
    ]
  },
  {
    group: "LIVE",
    groupName: "直播业务控件",
    items: [
      {
        name: "倒计时",
        widgetName: "List",
        widget: "",
        icon: "el-icon-timer"
      },
      {
        name: "进度条",
        widgetName: "List",
        widget: "",
        icon: "el-icon-more-outline"
      }
    ]
  }
];
export default {
  components: {
    "fold-bar": foldBar
  },
  data() {
    return {
      widgets
    };
  },
  mounted() {},
  methods: {
    handleDragstart(e) {
      e.dataTransfer.setData("WIDGET_TYPE", "hello");
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
  .group-title {
    user-select: none;
  }
  .widget {
    float: left;
    width: 80px;
    height: 90px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
    cursor: pointer;
    i {
      font-size: 28px;
      display: inline-block;
      max-width: 30px;
      max-height: 30px;
      margin-bottom: 5px;
    }
    p {
      padding: 4px;
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

