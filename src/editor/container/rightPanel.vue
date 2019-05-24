<template>
  <div class="right-panel">
    <fold-bar title="属性">
    </fold-bar>
  </div>
</template>
<script>
import foldBar from "../../components/foldBar";
export default {
  components: {
    "fold-bar": foldBar
  }
};
</script>
<style lang="scss" scoped>
.right-panel{
  height: 100%;
}
</style>

