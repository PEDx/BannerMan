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
              <el-button
                type="text"
                title="数值复制"
                style="padding: 4px 8px;margin-left: 0;"
                @click="handleCopy"
              >
                <i class="el-icon-document-copy"></i>
              </el-button>
              <el-button
                type="text"
                title="数值粘贴"
                style="padding: 4px 8px;margin-left: 0;"
                @click="handlePaste"
              >
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
        <template v-for="(val) in controllerList">
          <controller-item
            :key="`${val.id}`"
            v-if="val.controllerType !== custom_component_type_name"
          >
            <span slot="label">{{ val.label }}</span>
            <component
              :is="controllerTypeMap[val.controllerType]"
              slot="ctrl"
              :value="val.value"
              :setting="val.setting"
              @submit-update="handleSubmitUpdate(val.propName, ...arguments)"
            ></component>
          </controller-item>
          <div v-else :key="`${val.id}`" class="custom-controller controller-item">
            <component
              :is="val.customController"
              :value="val.value"
              :setting="val.setting"
              @submit-update="handleSubmitUpdate(val.propName, ...arguments)"
            ></component>
          </div>
        </template>
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
import foldBar from "@editor/components/split-pane/fold-bar";
import controllerItem from "@editor/components/controller-item";
import splitPane from "@editor/components/split-pane/split-pane";
import componentTree from "@editor/components/tree/component-tree";
import { controllers, controllerTypeMap } from "@editor/controllers";
import clonedeep from "lodash.clonedeep";
import {
  getViewportVueInstance,
  debounce,
  getRandomStr,
  UNDEFINED
} from "@utils/index";
import EventBus from "@/bus";
import storage from "@/storage";
const custom_component_type_name = "CTRL_CUSTOM";

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
    this.controllerMap = {};
    return {
      custom_component_type_name,
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
          const profile = ins.getSelectWidgetProfile();
          if (!profile.controllers) return;
          profile.controllers.forEach(val => {
            val.value = undefined;
          });
          this.controllerList = profile.controllers;
          this.name = profile.name;
          this.controllerList.forEach(val => {
            val.value = ins.getWidgetDataValue(val.propName);
            this.controllerMap[val.propName] = val;
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
      this.controllerMap[key].value = clonedeep(value);
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
    },
    handleCopy() {
      storage.set("local_clipboard", {
        name: this.name,
        controllers: this.controllerList
      });
    },
    handlePaste() {
      const obj = storage.get("local_clipboard") || {};
      if (obj.name !== this.name) return; // 只能同种组件数值复制
      const ins = getViewportVueInstance();
      obj.controllers.forEach(val => {
        const _value = val.value;
        val.value = _value === UNDEFINED ? undefined : _value;
        val.id = getRandomStr(6); // 更新控制器
        ins.updateWidgetProp(clonedeep({ key: val.propName, value: _value })); // 更新组件 props
      });
      this.controllerList = obj.controllers;
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

