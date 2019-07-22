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
            @dragstart="handleWidgetDragstart(...arguments, item)"
            @dragend="handleDragend"
          >
            <i :class="item.icon" v-if="!item.svg"></i>
            <svg-icon :icon="item.svg" v-else />
            <p>{{ item.name }}</p>
          </div>
        </div>
      </fold-bar>
      <fold-bar title="资源" slot="right" pos="bottom">
        <template slot="custom-right">
          <el-popover
            placement="bottom"
            width="300"
            trigger="click"
            :offset="-50"
            title="资源链接"
            v-model="addLinkPopovervisible"
          >
            <el-form ref="form" v-model="linkRes" label-width="40px">
              <el-form-item label="名称:">
                <el-input v-model="linkRes.name" placeholder="请输入资源名称"></el-input>
              </el-form-item>
              <el-form-item label="地址:">
                <el-input placeholder="请输入资源链接地址" v-model="linkRes.url"></el-input>
              </el-form-item>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addLinkPopovervisible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleAddLinkRes">添加</el-button>
              </div>
            </el-form>
            <el-button
              slot="reference"
              type="text"
              icon="el-icon-link"
              style="padding: 4px 5px;"
              title="资源链接"
              @click.native.stop
            ></el-button>
          </el-popover>

          <el-upload
            @click.native.stop
            class="upload-btn"
            style="display: inline-block;"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :limit="3"
            :show-file-list="false"
            :file-list="fileList"
            @on-progress="handleUploadProgress"
            @on-success="handleUploadSuccess"
            @on-error="handleUploadError"
          >
            <el-button type="text" icon="el-icon-upload2" title="上传资源" style="padding: 4px 5px;"></el-button>
          </el-upload>
        </template>
        <div class="file-list" style="padding: 8px 0;">
          <div
            :class="{'file-list-item': true, active: currentPickResItemIdx == idx}"
            v-for="(val, idx) in fileList"
            :key="`${val.name }-${idx}`"
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
                popper-class="resource-preview-popover"
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
import foldBar from "../components/split-pane/fold-bar";
import splitPane from "../components/split-pane/split-pane";
import { getViewportVueInstance } from "../../utils/index";
import EventBus from "../../bus";
const URL_REG = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/gi;
const widgets = [
  {
    group: "BASICS",
    groupName: "基础控件",
    items: [
      {
        name: "容器",
        widgetName: "widget-container",
        widget: "",
        icon: "el-icon-c-scale-to-original",
        svg: "builder"
      },
      {
        name: "标签容器",
        widgetName: "widget-tabs",
        widget: "",
        icon: "el-icon-more-outline",
        svg: "tab"
      },
      {
        name: "搜索",
        widgetName: "widget-search",
        widget: "",
        icon: "el-icon-search"
      },
      {
        name: "倒计时",
        widgetName: "widget-search",
        widget: "",
        icon: "el-icon-timer"
      },
      {
        name: "按钮",
        widgetName: "widget-button",
        widget: "",
        icon: "el-icon-aim",
        svg: "button"
      }
    ]
  },
  {
    group: "LIVE",
    groupName: "直播业务控件",
    items: [
      {
        name: "倒计时",
        widgetName: "widget-search",
        widget: "",
        icon: "el-icon-timer"
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
      deleteConfirmVisible: false,
      addLinkPopovervisible: false,
      checkImgName: "",
      splitPercent: +editorSetting.leftPanelSplit || 70,
      splitStatus: editorSetting.leftPanelStatus || {
        top: true,
        bottom: true
      },
      linkRes: {
        name: "",
        url: ""
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
    handleWidgetDragstart(e, widget) {
      getViewportVueInstance().setDragType("drag_widget");
      e.dataTransfer.setData("WIDGET_NAME", widget.widgetName);
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
      this.deleteConfirmVisible = false;
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
    },
    handleAddLinkRes() {
      const url = this.linkRes.url.trim();
      const name = this.linkRes.name.trim();
      if (!URL_REG.test(url)) {
        this.$message.error("请添加正确的资源 URl 地址");
        return;
      }
      this.addLinkPopovervisible = false;
      const pos = this.linkRes.url.lastIndexOf("/");
      const fileName = url.substring(pos + 1, url.length);
      this.fileList.push({
        name: name || fileName,
        url
      });
      this.linkRes = {};
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
      i {
        color: #eee;
      }
    }
    &:focus {
      background-color: #343438;
      color: #fd9527;
      outline: 0;
      i {
        color: #eee;
      }
    }
    &:active {
      background-color: #343438;
      color: #fd9527;
      outline: 0;
      i {
        color: #eee;
      }
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
      margin-right: 16px;
    }
  }
}
.check-view-img {
  display: inline-block;
  height: 200px;
}
</style>

