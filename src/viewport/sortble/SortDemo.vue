<template>
  <div id="sort-demo">
    <sort-container
      :bm-sort-container-data="dataList"
      bm-sort-container-height="400px"
      ref="sortContainer"
      @insert-end="handleInsertEnd"
      @sort-end="handleSortEnd"
    >
      <sort-element
        v-for="(val, idx) in dataList"
        :bm-sort-element-mixin-index="idx"
        :key="val.name"
      >{{ val.name }}</sort-element>
    </sort-container>
    <div
      class="btn"
      :draggable="true"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
      @drag="handleDrag"
    >开始插入</div>
  </div>
</template>
<script>
import SortContainer from "../viewport/sortble/SortContainer";
import SortElement from "../viewport/sortble/SortElement";
export default {
  components: {
    SortContainer,
    SortElement
  },
  data() {
    return {
      dataList: [
        { name: "name_000" },
        { name: "name_001" },
        { name: "name_002" },
        { name: "name_003" },
        { name: "name_004" },
        { name: "name_005" },
        { name: "name_006" },
        { name: "name_007" },
        { name: "name_008" },
        { name: "name_009" },
        { name: "name_010" }
      ]
    };
  },
  methods: {
    handleDragstart(e) {},
    handleDragend(e) {
      e.stopPropagation();
      e.preventDefault();
      this.$refs.sortContainer.handleDropEnd(e);
    },
    handleDrag(e) {
      // this.$refs.sortContainer.handleDragover(e);
    },
    handleInsertEnd(index) {
      this.dataList.splice(index, 0, {
        name: "new_name_" + this.dataList.length
      });
    },
    handleSortEnd() {
      // console.log(this.dataList);
    }
  }
};
</script>
<style lang="scss" scoped>
.btn {
  width: 200px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  background-color: red;
  margin: 0 auto;
  margin-top: 40px;
}
#sort-demo {
  position: relative;
}
</style>
