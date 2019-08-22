<template>
  <div class="menu-wrapper">
    <template v-if="!item.hidden && !item.children">
      <app-link :to="resolvePath(basePath, item.path)">
        <el-menu-item
          :index="resolvePath(basePath, item.path)"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <item v-if="item.meta" :icon="item.meta.icon||item.meta.icon" :title="item.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else :index="resolvePath(basePath, item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(basePath, item.path)"
          class="nest-menu"
        />
        <app-link
          v-else
          :to="resolvePath(resolvePath(basePath, item.path), child.path)"
          :key="child.name"
        >
          <el-menu-item :index="resolvePath(resolvePath(basePath, item.path), child.path)">
            <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";
import Item from "./Item";
import AppLink from "./Link";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(basePath, routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(basePath, routePath);
    },
    isExternalLink(routePath) {
      return isExternal(routePath);
    }
  }
};
</script>
