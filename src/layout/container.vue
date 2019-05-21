<template>
  <div class="container">
    <div class="btn" @click="scroll"></div>
    <div :style="{width: `${leftWidth}px`, marginRight: `-${leftWidth}px`}" class="left"></div>
    <div class="mid">
      <div :style="{margin: `0 ${ rightWidth}px 0 ${leftWidth}px`}" class="mid-content"></div>
    </div>
    <div :style="{width: `${rightWidth}px`, marginLeft: `-${rightWidth}px`}" class="right"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      leftWidth: 230,
      rightWidth: 230
    };
  },
  methods: {
    scroll() {
      this.leftWidth = !this.leftWidth ? 230 : 0;
      this.rightWidth = !this.rightWidth ? 230 : 0;
    }
  }
};
</script>
<style scoped>
.container {
  position: relative;
  overflow: hidden;
  height: 100%;
}
.left,
.right {
  position: relative;
  float: left;
  height: 100%;
  background-color: #414146;
  transition: all 0.5s;
}
.right {
  float: right;
  margin: 0 0 0 -190px;
}
.mid {
  float: left;
  width: 100%;
  height: 100%;
}
.mid-content {
  height: 100%;
  transition: all 0.5s;
  background-image: linear-gradient(
      45deg,
      #666 25%,
      transparent 0,
      transparent 75%,
      #666 0,
      #666
    ),
    linear-gradient(
      45deg,
      #666 25%,
      transparent 0,
      transparent 75%,
      #666 0,
      #666
    );
  background-position: 0 0, 8px 8px;
  background-size: 16px 16px;
  background-color: #444;
}
.left,
.right {
  outline: 1px solid #252527;
}
.btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background-color: red;
  width: 40px;
  height: 40px;
  z-index: 9;
}
</style>

