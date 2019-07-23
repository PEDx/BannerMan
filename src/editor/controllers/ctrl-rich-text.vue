<template>
  <div class="ctrl-rich-text">
    <el-button type="primary" @click="handleShow">
      <svg-icon icon="layers" :width="12" :height="12"/>
    </el-button>
    <float-window :show.sync="showWindow" :position="nodePos" :size="nodeSize" title="富文本编辑器">
      <div class="rich-text-editor">
        <quill-editor :content="value" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
      </div>
    </float-window>
  </div>
</template>
<script>
import floatWindow from "../components/float-window";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["image", "video", "clean"] // remove formatting button
];

export default {
  components: {
    floatWindow,
    quillEditor
  },
  props: {
    value: String
  },

  data() {
    this.editorOption = {
      placeholder: "写点什么...",
      modules: {
        toolbar: toolbarOptions
      }
    };
    return {
      showWindow: false,
      nodePos: {
        x: 0,
        y: 0
      },
      nodeSize: {
        width: 600,
        height: 400
      }
    };
  },
  watch: {
    input() {
      this.$emit("submit-update", this.input);
    }
  },
  mounted() {
    const rect = this.$el.getBoundingClientRect();
    this.nodePos = {
      x: rect.x - this.nodeSize.width - 140,
      y: rect.y - this.nodeSize.height / 2
    };
  },
  methods: {
    handleShow() {
      this.showWindow = !this.showWindow;
    },
    handleChange() {},
    onEditorChange(e) {
      // console.log(e.html);
      this.$emit("submit-update", e.html);
    }
  }
};
</script>
<style lang="scss" scoped>
.ctrl-rich-text {
  height: 100%;
}
</style>
<style lang="scss">
.rich-text-editor {
  height: 100%;
  background-color: #fff;
  color: #000;
  overflow: auto;
  .ql-toolbar.ql-snow {
    border: 0;
    border-bottom: 1px solid #252525;
  }
  .ql-container.ql-snow {
    border: 0;
  }
}
</style>
