<template>
  <div class="top-bar">
    <div class="logo">
      <img src="../../../static/img/logo/logo-28.png" />
      <h1 class="txt">Banner Man</h1>
    </div>
    <div class="function">
      <el-row style="height: 100%;">
        <el-col :span="10"></el-col>
        <el-col :span="4" style="text-align: center;">
          <el-select v-model="value" placeholder="请选择" style="width: 210px;" @change="handleChange">
            <template slot="prefix">
              <i class="el-icon-view"></i>
            </template>
            <el-option
              v-for="(item, key) in options"
              :key="key"
              :label="`${item.desc} / (${item.resolution.width}x${item.resolution.height})`"
              :value="key"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="10" style="text-align: right;">
          <el-dropdown trigger="click">
            <el-button type="primary" icon="el-icon-mobile-phone" style="margin-left: 10px;">
              预览
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-files" @click.native="handlePreviewPage">本地预览</el-dropdown-item>
              <el-dropdown-item icon="el-icon-s-grid" @click.native="handleScanPreview">扫码预览</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-popover placement="top" width="160" v-model="clearConfirmVisible">
            <p>确认清空全部组件？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="clearConfirmVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="clearViewportPage">确定</el-button>
            </div>
            <el-button
              slot="reference"
              type="primary"
              icon="el-icon-delete-solid"
              style="margin-left: 10px;"
            >清空</el-button>
          </el-popover>
          <el-button
            type="primary"
            icon="el-icon-document-checked"
            style="margin-left: 10px;"
            @click="saveViewportPage"
          >保存</el-button>
          <el-button
            type="primary"
            icon="el-icon-sell"
            style="margin-left: 10px;"
            @click="deployPage"
          >发布</el-button>
          <el-dropdown trigger="click">
            <el-button type="primary" style="margin-left: 10px;">
              更多
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                icon="el-icon-coffee-cup"
                @click.native="handleShowThemeWindow"
              >主题调色板</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-files"
                @click.native="handleShowWidgetVersionWindow"
              >控件版本控制</el-dropdown-item>
              <el-dropdown-item
                icon="el-icon-s-cooperation"
                @click.native="dialogVisible = true"
              >组件开发模式</el-dropdown-item>
              <!-- <el-dropdown-item icon="el-icon-cpu">燃烧 GPU</el-dropdown-item> -->
              <el-dropdown-item icon="el-icon-discover" @click.native="handleShowGuide">引导</el-dropdown-item>
              <el-dropdown-item icon="el-icon-user-solid">用户设置</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <float-window :show.sync="showThemeWindow" :position="nodePos" :size="nodeSize" title="主题调色板">
      <theme-color-picker></theme-color-picker>
    </float-window>
    <el-dialog title="组件开发模式" :visible.sync="dialogVisible" width="50%">
      <el-form ref="createPageForm" :model="form" label-width="80px">
        <el-form-item label="组件名称" required>
          <el-input clearable v-model="form.name" placeholder="组件名称, 默认: widget-dev"></el-input>
        </el-form-item>
        <el-form-item label="组件地址" prop="name" required>
          <el-input v-model="form.src" clearable placeholder="请输入开发组件的 js 文件地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <float-window
      :show.sync="showWidgetVersionWindow"
      :position="nodePos"
      :size="{
        width: 400,
        minWidth: 400,
        minHeight: 600,
        height: 600
      }"
      title="控件版本控制"
    >
      <widget-version-control
        :new-version="new_widget_version"
        :version="widget_version"
        @update-version="handleUpdateVersion"
      ></widget-version-control>
    </float-window>
    <float-window
      :show.sync="showPreviewWindow"
      :position="nodePos"
      :hide-resizable="true"
      :size="{
        width: options[value].resolution.width,
        minWidth: options[value].resolution.width,
        minHeight: options[value].resolution.height,
        height: options[value].resolution.height
      }"
      title="预览窗口"
    >
      <el-button
        slot="btn"
        type="text"
        icon="el-icon-refresh"
        style="float: left;padding-right: 4px;"
        @click="refreshPreviewFrame"
      ></el-button>
      <iframe
        v-if="showPreviewWindow"
        id="iframe-preview"
        ref="preview"
        name="preview"
        :style="`width: 100%;height: 100%;`"
        :src="renderPageUrl"
        frameborder="0"
      ></iframe>
    </float-window>
    <div id="qrcode" ref="qrcode" style="display: none;"></div>
  </div>
</template>
<script>
import {
  reqPageWidgetsVersion,
  reqGetWidgetList,
  reqUpdateWidgetVersion
} from "@api/page";
import floatWindow from "@editor/components/float-window";
import themeColorPicker from "@editor/components/theme-color-picker";
import widgetVersionControl from "@editor/components/widget-version-control";
import deviceModelList from "./device";
import EventBus from "@/bus";
import clonedeep from "lodash.clonedeep";
import QRCode from "qrcodejs2";
import { getViewportVueInstance, parseQueryString } from "@utils/index";

export default {
  components: { floatWindow, themeColorPicker, widgetVersionControl },
  data() {
    this.nodeSize = {
      width: 1040,
      minWidth: 1040,
      minHeight: 400,
      height: 400
    };
    this.renderPageUrl = "";
    this.pageID = "";
    return {
      form: {},
      clearConfirmVisible: false,
      dialogVisible: false,
      showThemeWindow: false,
      showWidgetVersionWindow: false,
      showPreviewWindow: false,
      options: deviceModelList,
      widget_version: {},
      new_widget_version: [],
      value: this.$store.state.editor.setting.deviceType || "iphone6",
      nodePos: {
        x: 0,
        y: 0
      }
    };
  },
  created() {
    const id = (this.pageID = parseQueryString(location.href).id);
    this.renderPageUrl = `${location.origin}/preview?id=${id}`;
  },
  mounted() {
    this.handleChange();
    const rect = this.$el.getBoundingClientRect();
    this.nodePos = {
      x: rect.width / 2 - this.nodeSize.width / 2,
      y: 150
    };
    new QRCode(document.getElementById("qrcode"), {
      text: this.renderPageUrl,
      width: 128,
      height: 128,
      colorDark: "#ffffff",
      colorLight: "#343438",
      correctLevel: QRCode.CorrectLevel.H
    });
  },
  methods: {
    handleChange() {
      this.value && this.$store.dispatch("update_device_type", this.value);

      getViewportVueInstance().then(ins => {
        ins.changeViewSize(
          clonedeep(deviceModelList[this.value || "iphone6"].resolution)
        );
      });
    },
    handleShowThemeWindow() {
      this.showThemeWindow = !this.showThemeWindow;
    },
    handleShowWidgetVersionWindow() {
      if (!this.showWidgetVersionWindow) {
        this.freshVersionInfo();
      }
      this.showWidgetVersionWindow = !this.showWidgetVersionWindow;
    },
    freshVersionInfo() {
      reqPageWidgetsVersion(this.pageID).then(res => {
        this.widget_version = res.data;
      });
      reqGetWidgetList().then(res => {
        this.new_widget_version = res.data;
      });
    },
    handleUpdateVersion(nameArr) {
      reqUpdateWidgetVersion({
        id: this.pageID,
        widgetNameList: nameArr
      }).then(() => {
        EventBus.$emit("reload-viewport");
        this.freshVersionInfo();
      });
    },
    handleShowGuide() {
      this.$store.dispatch("update_guide_visibility", true);
    },
    clearViewportPage() {
      this.clearConfirmVisible = false;
      getViewportVueInstance().then(ins => {
        ins.clearPage();
      });

      EventBus.$emit("clear-viewport");
    },
    saveViewportPage() {
      getViewportVueInstance().then(ins => {
        ins.savePage().then(res => {
          res.code === 0 &&
            this.$message({
              message: "保存成功",
              type: "success"
            });
        });
      });
    },
    deployPage() {
      const loading = this.$loading({
        lock: true,
        text: "拼命构建中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getViewportVueInstance().then(ins => {
        ins.deployPage().then(res => {
          loading.close();
          res.code === 0 &&
            this.$message({
              message: "构建成功",
              type: "success"
            });
        });
      });
    },
    handlePreviewPage() {
      this.showPreviewWindow = true;
    },
    handleScanPreview() {
      this.$notify({
        title: "预览二维码",
        message: this.$refs.qrcode.innerHTML,
        duration: 0,
        dangerouslyUseHTMLString: true
      });
    },
    refreshPreviewFrame() {
      this.$refs.preview.contentWindow.location.reload(true);
    }
  }
};
</script>
<style scoped lang="scss">
.top-bar {
  height: 100%;
  .logo {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    line-height: 31px;
    text-align: center;
    padding-left: 42px;
    padding-right: 20px;
    border-right: 1px solid #262629;
    img {
      position: absolute;
      top: 3px;
      left: 10px;
      height: 24px;
      display: inline-block;
    }
    .txt {
      display: inline-block;
      color: #7a7a7a;
      font-size: 14px;
      font-weight: normal;
    }
  }
  .function {
    float: right;
    width: 100%;
    height: 100%;
  }
  .el-col {
    height: 100%;
    padding: 0 8px;
    padding-top: 6px;
  }
  .title {
    color: #aaa;
    text-align: center;
    padding-top: 6px;
  }
}
</style>

