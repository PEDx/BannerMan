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
            @dragstart="handleWidgetDragstart"
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
            :class="{'file-list-item': true, active: currentPickResItemIdx == idx}"
            v-for="(val, idx) in fileList"
            :key="idx"
            :draggable="true"
            @dragstart="handleResDragstart(...arguments, val)"
            @dragend="handleResDragend"
            @click="handleClick(idx)"
          >
            <p class="f-toe">
              <i class="el-icon-picture item-icon"></i>
              {{ val.name }}
              <el-popover
                placement="right"
                :title="`预览 ${checkImgName} ${checkImgResolution}`"
                width="auto"
                trigger="click"
                content
                :popper-options="{
                  removeOnDestroy: true
                }"
                transition
                @after-enter="popoverShow(val)"
              >
                <div class="content">
                  <img :src="checkImgSrc" alt class="check-view-img" />
                </div>

                <div slot="reference" class="f-fr">
                  <el-button type="text" class="item-icon" icon="el-icon-view"></el-button>
                </div>
              </el-popover>
              <el-button
                type="text"
                class="item-icon delete-img f-fr"
                icon="el-icon-delete"
                @click="handleDelete(idx)"
              ></el-button>
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
import EventBus from "../../bus";
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
      checkImgResolution: "",
      checkImgName: "",
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
          name: "lizhi.png",
          url: "http://fepublic.lizhi.fm/logos/logo_with_name_horizon.png"
        },
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "lizhi.png",
          url: "http://fepublic.lizhi.fm/logos/logo_with_name_horizon.png"
        },
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "lizhi.png",
          url: "http://fepublic.lizhi.fm/logos/logo_with_name_horizon.png"
        }
      ],
      currentPickResItemIdx: -1
    };
  },
  mounted() {},
  methods: {
    handleWidgetDragstart(e) {
      getViewportVueInstance().setDragType("drag_widget");
      e.dataTransfer.setData("WIDGET_TYPE", "hello");
    },
    handleResDragstart(e, file) {
      getViewportVueInstance().setDragType("drag_resource");
      e.dataTransfer.setData("RESOURCE_TYPE", "image");
      e.dataTransfer.setData("RESOURCE_FILE", JSON.stringify(file));
    },
    handleDragend(e) {
      getViewportVueInstance().onDragend(e);
    },
    handleResDragend(e) {
      EventBus.$emit("resource-dragend");
    },
    handleClick(idx) {
      this.currentPickResItemIdx = idx;
    },
    handleDelete(idx) {
      this.fileList.splice(idx, 1);
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
      this.checkImgName = img.name;
      this.setImgNaturalWHInfo(img.url);
    },
    setImgNaturalWHInfo(url) {
      var image = new Image();
      image.src = url;
      const naturalWidth = image.width;
      const naturalHeight = image.Height;
      image.onload = () => {
        this.checkImgResolution = `( ${image.naturalWidth ||
          naturalWidth} x ${image.naturalHeight || naturalHeight} )`;
      };
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
      background-color: #343438;
      color: #fd9527;
    }
    &:focus {
      background-color: #343438;
      color: #fd9527;
      outline: 0;
    }
    &:active {
      background-color: #343438;
      color: #fd9527;
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
        background-color: #343438;
        // color: #fd9527;
      }
      &:focus {
        outline: 0;
      }
      &:active {
        outline: 0;
      }
    }
    .active {
      background-color: #343438;
      color: #fd9527;
      outline: 0;
    }
    .item-icon {
      font-size: 12px;
      margin-right: 2px;
      position: relative;
      padding: 4px 0;
    }
    .delete-img {
      top: 2px;
      margin-right: 12px;
    }
  }
}
.check-view-img {
  display: inline-block;
  height: 200px;
}
</style>

