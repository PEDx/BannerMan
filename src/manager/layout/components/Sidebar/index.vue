<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo">
      <img src="../../../../../static/img/logo.png" alt srcset />
      <span class="logo-txt">Banner Manager</span>
      <div class="separate"></div>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#343438"
      text-color="#fff"
      active-text-color="#fd9527"
    >
      <sidebar-item
        v-for="route in routes.children"
        :key="route.path"
        :item="route"
        :base-path="routes.path"
      ></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      let rootRoute = null;
      this.$router.options.routes.forEach(val => {
        if (val.root) rootRoute = val;
      });
      return rootRoute;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  created() {
    // console.log(this.$router);
  }
};
</script>
