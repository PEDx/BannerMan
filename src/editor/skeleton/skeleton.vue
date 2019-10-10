<template>
  <div :class="['timeline-item', isDarkMode && 'dark-mode']">
    <div class="top-bar animated-background timeline-box"></div>
    <div class="layout f-cb">
      <div class="g-sd51 timeline-box">
        <div class="top timeline-box">
          <div class="info animated-background"></div>
          <div class="item-list">
            <div class="item" v-for="n in 10" :key="n">
              <div class="round animated-background"></div>
              <div class="info animated-background"></div>
            </div>
          </div>
          <div class="info animated-background" v-for="n in 3" :key="n"></div>
        </div>
        <div class="bottom timeline-box">
          <div class="info animated-background" v-for="n in 8" :key="n">
            <div class="empty"></div>
          </div>
        </div>
      </div>
      <div class="g-mn5">
        <div class="g-mn5c">
          <div class="viewport animated-background timeline-box"></div>
        </div>
      </div>
      <div class="g-sd52 timeline-box">
        <div class="top timeline-box">
          <div class="info-one animated-background"></div>
          <div class="info animated-background" v-for="n in 8" :key="n">
            <div class="round">
              <span class="animated-background"></span>
            </div>
          </div>
        </div>
        <div class="bottom timeline-box animated-background"></div>
      </div>
    </div>
    <div class="bottom-bar animated-background timeline-box"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isDarkMode: false
    };
  }
};
</script>
<style>
html,
body,
#app {
  height: 100%;
}
body {
  margin: 0px;
}
</style>

<style lang="css" scoped>
.timeline-box {
  border: 2px solid;
  border-color: #e5e6e9;
  border-radius: 3px;
  box-sizing: border-box;
}
.timeline-item {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.animated-background {
  animation: placeHolderShimmer 1.4s ease infinite;
  background: linear-gradient(90deg, #e7e7e7 25%, #dbdbdb 37%, #e7e7e7 63%);
  /* background: linear-gradient(90deg, #fff0e0 25%, #fff7f0 37%, #fff0e0 63%); */
  background-size: 400% 100%;
  height: 40px;
  position: relative;
}

.layout {
  height: 100%;
  padding: 40px 10px;
  padding-bottom: 32px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}
.top-bar,
.bottom-bar {
  position: absolute;
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
}
.top-bar {
  top: 0;
}
.bottom-bar {
  bottom: 0;
  margin-bottom: 0px;
  margin-top: 10px;
  height: 22px;
}
.g-sd51,
.g-sd52 {
  display: flex;
  flex-direction: column;
  float: left;
  width: 300px;
  margin: 0 -300px 0 0;
  height: 100%;
  padding: 10px;
  overflow: hidden;
}
.g-sd51 .top,
.g-sd52 .top {
  width: 100%;
  height: 450px;
  margin-bottom: 10px;
  padding: 10px;
  overflow: hidden;
}
.g-sd52 .top {
  height: 560px;
}
.g-sd51 .bottom,
.g-sd52 .bottom {
  flex: 1;
  padding: 10px;
  overflow: hidden;
}
.g-sd52 {
  float: right;
  width: 400px;
  margin: 0 0 0 -400px;
}
.g-mn5 {
  float: left;
  width: 100%;
  height: 100%;
}
.g-mn5c {
  height: 100%;
  margin: 0 310 0 310;
}
.viewport {
  width: 375px;
  height: 667px;
  margin: 0 auto;
  position: relative;
  top: 20px;
}
.item-list {
  overflow: hidden;
}
.item {
  width: 50px;
  float: left;
  margin-left: 11px;
  margin-bottom: 20px;
}
.item .round {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 5px;
}
.info {
  width: 100%;
  height: 20px;
  margin-bottom: 20px;
}
.item .info {
  margin: 0;
}
.bottom .info {
  margin-bottom: 10px;
}
.empty {
  height: 100%;
  width: 10px;
  float: left;
  background-color: #fff;
  margin-left: 30px;
}
.info .round {
  width: 25px;
  height: 100%;
  background-color: #fff;
  float: left;
}
.info .round span {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
.info-one {
  height: 40px;
  margin-bottom: 20px;
}

.dark-mode.timeline-item {
  background-color: #414146;
}
.dark-mode .timeline-box {
  border-color: #252527;
}
.dark-mode .animated-background {
  background: linear-gradient(90deg, #333336 25%, #2e2e31 37%, #333336 63%);
  background-size: 400% 100%;
}
.dark-mode .info .round {
  background-color: #414146;
}
.dark-mode .empty {
  background-color: #414146;
}
</style>
