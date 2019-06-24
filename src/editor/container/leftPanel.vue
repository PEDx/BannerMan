<template>
  <div class="left-panel">
    <split-pane
      @split-change="handleSplitChange"
      :split-percent="splitPercent"
      :split-status="splitStatus"
    >
      <fold-bar title="控件" slot="left" pos="top">
        <template slot="custom-right">
          <el-popover placement="bottom" width="200" trigger="click" :offset="-50">
            <el-input v-model="searchValue" placeholder="请输入内容"></el-input>
            <el-button
              type="text"
              icon="el-icon-search"
              slot="reference"
              style="padding: 4px 5px;"
              @click.native.stop
            ></el-button>
          </el-popover>
        </template>
        <div
          v-for="(val, idx) in widgets"
          ref="groupBox"
          :key="idx"
          class="group"
          style="overflow: hidden;padding: 8px;"
        >
          <div class="group-title">{{ val.groupName }}</div>
          <div
            v-for="(item, index) in val.items"
            :key="index"
            :draggable="true"
            class="widget"
            style="overflow: hidden"
            :tabindex="-1"
            @dragstart="handleDragstart"
            @dragend="handleDragend"
          >
            <i :class="item.icon"></i>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </fold-bar>
      <fold-bar title="资源" slot="right" pos="bottom">
        <template slot="custom-right">
          <el-upload
            @click.native.stop
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :show-file-list="false"
            :file-list="fileList"
            @on-progress="handleUploadProgress"
            @on-success="handleUploadSuccess"
            @on-error="handleUploadError"
          >
            <el-button type="text" icon="el-icon-plus" style="padding: 4px 5px;"></el-button>
          </el-upload>
        </template>
        <div class="file-list" style="padding: 8px 0;">
          <div
            class="file-list-item"
            v-for="(val, idx) in fileList"
            :key="idx"
            :draggable="true"
            :tabindex="-1"
          >
            <p class="f-toe">
              <i class="el-icon-picture item-icon"></i>
              {{ val.name }}
              <el-popover
                placement="right"
                title="预览"
                width="auto"
                trigger="hover"
                content
                transition
                @after-enter="popoverShow(val)"
              >
                <img :src="checkImgSrc" alt class="check-view-img">
                <el-button
                  slot="reference"
                  type="text"
                  class="item-icon f-fr check-img"
                  icon="el-icon-view"
                ></el-button>
              </el-popover>
            </p>
          </div>
        </div>
      </fold-bar>
    </split-pane>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
import splitPane from "../components/split-pane";
import { getViewportVueInstance } from "../../utils/index";
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
    "fold-bar": foldBar,
    "split-pane": splitPane
  },
  data() {
    const editorSetting = this.$store.state.editor.setting;
    return {
      widgets,
      searchValue: "",
      checkImgSrc: "",
      splitPercent: +editorSetting.leftPanelSplit || 70,
      splitStatus: editorSetting.leftPanelStatus || {
        top: true,
        bottom: true
      },
      fileList: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleDragstart(e) {
      e.dataTransfer.setData("WIDGET_TYPE", "hello");
    },
    handleDragend(e) {
      getViewportVueInstance().onDragend(false);
    },
    handleUploadSuccess() {},
    handleUploadProgress() {},
    handleUploadError(e) {
      console.log(e);
    },
    handleSplitChange(data) {
      this.$store.dispatch("update_lf_spt", data.split);
      this.$store.dispatch("update_lf_spt_status", data.status);
    },
    popoverShow(img) {
      this.checkImgSrc = img.url;
    }
  }
};
</script>
<style lang="scss" scoped>
$img-icon-color: #85a4dc;
$file-icon-color: #4ca2ab;
.left-panel {
  height: 100%;
  .group-title {
    user-select: none;
    margin-bottom: 8px;
  }
  .widget {
    float: left;
    width: 80px;
    height: 90px;
    text-align: center;
    box-sizing: border-box;
    padding-top: 20px;
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 1px;
    margin-bottom: 1px;
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
    }
    &:hover {
      background-color: #fd9527;
      color: #333;
    }
    &:focus {
      background-color: #fd9527;
      color: #333;
      outline: 0;
    }
    &:active {
      background-color: #fd9527;
      color: #333;
      outline: 0;
    }
  }
  .file-list {
    .file-list-item {
      height: 24px;
      line-height: 24px;
      box-sizing: border-box;
      padding: 0 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 1px;
      &:hover {
        background-color: #fd9527;
        color: #333;
        .check-img {
          display: inline-block;
        }
      }
      &:focus {
        background-color: #fd9527;
        color: #333;
        outline: 0;
      }
      &:active {
        background-color: #fd9527;
        color: #333;
        outline: 0;
      }
    }
    .item-icon {
      font-size: 16px;
      color: $img-icon-color;
      margin-right: 2px;
      position: relative;
      top: 2px;
    }
    .check-img {
      display: none;
      font-size: 14px;
      color: #333;
      // top: 5px;
      padding: 4px 0;
    }
  }
}
.check-view-img {
  display: inline-block;
  height: 200px;
}
</style>

