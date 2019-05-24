<template>
  <div class="right-panel">
    <attribute-bar title="属性">
    </attribute-bar>
  </div>
</template>
<script>
import attributeBar from "../../components/attributeBar";
export default {
  components: {
    "attribute-bar": attributeBar
  }
};
</script>
<style lang="scss" scoped>
.right-panel{
  height: 100%;
}
</style>

