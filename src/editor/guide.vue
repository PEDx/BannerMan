<template>
  <transition name="fade">
    <div class="guide" v-if="show">
      <div class="content">
        <div class="brand">
          <img
            src="https://cdn.dribbble.com/users/78464/screenshots/6818614/untitled_artwork_2x.jpg"
            alt
          />
        </div>
        <div class="info">
          <div class="header">欢迎来到 Banner Man !</div>
          <div class="version">版本 1.0.13</div>
          <div class="feat">版本特性:</div>
          <ul>
            <li>可定义全局主题颜色</li>
            <li>统一资源管理</li>
            <li>新添加轮播, 按钮, 容器等组件</li>
          </ul>
          <div class="tutorial-link">
            <el-link type="danger">快速入门</el-link>
            <el-link type="danger">开发文档</el-link>
          </div>
          <div class="btn">
            <el-button type="text" @click="handleEnter">
              进入编辑器
              <i class="el-icon-d-arrow-right"></i>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      show: true
    };
  },
  methods: {
    handleEnter() {
      this.show = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.guide {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
  .content {
    width: 670px;
    min-width: 670px;
    height: 420px;
    padding: 0;
    border-radius: 4px;
    background-color: #3d3b3b;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -335px;
    margin-top: -200px;
    overflow: hidden;
    font-family: Nunito Sans;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    .brand {
      float: left;
      height: 100%;
      width: 380px;
      img {
        display: inline-block;
        height: 100%;
        margin-left: -10%;
      }
    }
    .info {
      position: relative;
      float: right;
      height: 100%;
      background-color: #252525;
      width: 290px;
      padding: 30px 28px 28px;
      position: relative;
      box-sizing: border-box;
      color: #eee;
      .header {
        font-size: 20px;
        padding: 4px 0;
      }
      .version {
        font-size: 12px;
      }
      .feat {
        margin-top: 18px;
        font-size: 18px;
      }
      .tutorial-link {
        position: absolute;
        bottom: 60px;
        left: 28px;
        a {
          margin-right: 15px;
        }
      }
      ul {
        margin-left: 20px;
        margin-top: 8px;
        margin-bottom: 20px;
      }
      li {
        list-style: disc;
        list-style-position: 5px;
        padding-bottom: 6px;
      }
      .btn {
        position: absolute;
        bottom: 20px;
        right: 28px;
        text-align: right;
      }
    }
  }
}
</style>
