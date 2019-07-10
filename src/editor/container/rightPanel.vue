<template>
  <div class="right-panel">
    <split-pane
      @split-change="handleSplitChange"
      :split-percent="splitPercent"
      :split-status="splitStatus"
    >
      <fold-bar title="属性控制" slot="left" pos="top">
        <div slot="prefix" class="component-info" v-if="controllerList.length">
          <div class="box">
            <span class="name">{{ name }}</span>
            <div class="btn f-fr">
              <el-button type="text" title="数值复制" style="padding: 4px 8px;margin-left: 0;">
                <i class="el-icon-document-copy"></i>
              </el-button>
              <el-button type="text" title="数值粘贴" style="padding: 4px 8px;margin-left: 0;">
                <i class="el-icon-brush"></i>
              </el-button>
              <el-button
                type="text"
                title="还原"
                @click="handleResetClick"
                style="padding: 4px 8px;margin-left: 0;"
              >
                <i class="el-icon-refresh-left"></i>
              </el-button>
              <el-popover placement="top" width="160" v-model="deleteConfirmVisible">
                <p>确认删除此组件？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="deleteConfirmVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDeleteClick">确定</el-button>
                </div>
                <el-button
                  slot="reference"
                  type="text"
                  title="删除"
                  style="padding: 4px 8px;margin-left: 0;"
                >
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-popover>
            </div>
          </div>
        </div>
        <controller-item v-for="(val) in controllerList" :key="`${val.id}`">
          <span slot="label">{{ val.label }}</span>
          <component
            :is="controllerTypeMap[val.controllerType]"
            slot="ctrl"
            :value="val.value"
            :setting="val.setting"
            ref="ctrls"
            @submit-update="handleSubmitUpdate(val.propName, ...arguments)"
          ></component>
        </controller-item>
      </fold-bar>
      <fold-bar
        title="组件导航"
        slot="right"
        pos="bottom"
        ref="tree"
        @content-scroll-percent="handleContentScroll"
      >
        <component-tree :instances="instancesTree" v-model="instancesTree"></component-tree>
      </fold-bar>
    </split-pane>
  </div>
</template>
<script>
import foldBar from "../components/fold-bar";
import controllerItem from "../components/controller-item";
import splitPane from "../components/split-pane";
import componentTree from "../components/tree/component-tree";
import { controllers, controllerTypeMap } from "../controllers";
import clonedeep from "lodash.clonedeep";
import {
  getViewportVueInstance,
  debounce,
  getRandomStr
} from "../../utils/index";
import EventBus from "../../bus";

export default {
  components: {
    foldBar,
    controllerItem,
    componentTree,
    splitPane,
    ...controllers
  },
  data() {
    const editorSetting = this.$store.state.editor.setting;
    return {
      splitPercent: +editorSetting.rightPanelSplit || 70,
      splitStatus: editorSetting.rightPanelStatus || {
        top: true,
        bottom: true
      },
      controllerTypeMap,
      controllerList: [],
      instancesTree: [],
      deleteConfirmVisible: false,
      name: ""
    };
  },
  mounted() {
    window.addEventListener(
      "message",
      e => {
        // 选定一个元素
        if (e.data.type === "select-component") {
          const ins = getViewportVueInstance();
          e.data.profile.controllers.forEach(val => {
            val.value = undefined;
          });
          const profile = e.data.profile;
          this.controllerList = profile.controllers;
          // debugger;
          this.name = profile.name;
          this.controllerList.forEach(val => {
            val.value = ins.getWidgetDataValue(val.propName);
            val.id = getRandomStr(6);
          });
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 刷新组件树
        if (e.data.type === "flush-component-tree") {
          this.instancesTree = e.data.instancesTree;
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 滚动条同步
        if (e.data.type === "viewport-scroll-percent") {
          this.viewportSrcolling = true;
          this.$refs.tree.contentScrollTo(+e.data.percent);
          this.scrollEnd();
        }
      },
      false
    );
    window.addEventListener(
      "message",
      e => {
        // 刷新控制器列表数值
        if (e.data.type === "flush-controller-value") {
          const ins = getViewportVueInstance();
          this.controllerList.forEach(val => {
            val.value = ins.getWidgetDataValue(val.propName);
          });
        }
      },
      false
    );
    EventBus.$on("clear-viewport", () => {
      this.controllerList = [];
      this.instancesTree = [];
    });
    EventBus.$on("tree-enter-instance", id => {
      getViewportVueInstance().highlighitInstance(id);
    });
    EventBus.$on("tree-select-instance", id => {
      getViewportVueInstance().highlighitSelectedInstance(id);
    });
    this.scrollEnd = debounce(() => {
      this.viewportSrcolling = false;
    }, 500);
  },
  methods: {
    handleSplitChange(data) {
      this.$store.dispatch("update_rt_spt", data.split);
      this.$store.dispatch("update_rt_spt_status", data.status);
    },
    handleSubmitUpdate(key, value) {
      const ins = getViewportVueInstance();
      ins.updateWidgetProp(clonedeep({ key, value }));
    },
    handleContentScroll(percent) {
      // 此处会相互触发 srcoll 事件, 需要防止
      if (this.viewportSrcolling) return;
      const ins = getViewportVueInstance();
      ins.viewportScrollTo(percent);
    },
    handleResetClick() {
      const ins = getViewportVueInstance();
      ins.resetComponentPropData();
      this.$nextTick(() =>
        this.controllerList.forEach(val => {
          val.value = ins.getWidgetDataValue(val.propName);
          val.id = getRandomStr(6);
        })
      );
    },
    handleDeleteClick() {
      this.deleteConfirmVisible = false;
      const ins = getViewportVueInstance();
      ins.deleteComponentFromModel();
    }
  }
};
</script>
<style lang="scss" scoped>
.right-panel {
  height: 100%;
  .component-info {
    padding: 14px 8px;
    padding-bottom: 8px;
    .box {
      height: 20px;
      line-height: 20px;
      color: #fd9527;
      border: 1px solid #343438;
      padding: 4px 10px;
      /* padding-bottom: 0; */
      background-color: #252525;
      border-radius: 4px;
    }
    .btn {
      margin-right: -8px;
    }
  }
}
</style>

