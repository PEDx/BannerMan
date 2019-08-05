<template>
  <div class="scroll-pane">
    <div class="header">
      <slot name="header"/>
    </div>
    <div class="scroll" ref="scroll" @scroll="handleScroll">
      <slot name="scroll"/>
    </div>
    <div v-if="$slots.footer" class="footer">
      <slot name="footer"/>
    </div>
  </div>
</template>

<script>
import { throttle } from "@utils/index";
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    percent: function(val) {
      this.scrollTo(val);
    }
  },
  created() {
    this.handleScroll = throttle(() => {
      const _el = this.$refs.scroll;
      const scroll_top = _el.scrollTop;
      const scroll_height = _el.scrollHeight;
      const el_height = _el.clientHeight;
      const percent = scroll_top / (scroll_height - el_height);
      this.$emit("pane-scroll", percent);
    }, 20);
  },
  methods: {
    scrollTo(percent) {
      const _el = this.$refs.scroll;
      const scroll_height = _el.scrollHeight;
      const el_height = _el.clientHeight;
      _el.scrollTo({
        top: (scroll_height - el_height) * percent
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.scroll-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.scroll {
  flex: 1;
  overflow: auto;
  &::-webkit-scrollbar {
    background: #343438;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: lighten(#343438, 7%);
    border-radius: 2px;
  }
  &::-webkit-scrollbar {
    width: 5px;
    height: 0;

    &-thumb {
      background: #7f7c87;
    }
  }
}

.scroll--themed {
  &::-webkit-scrollbar {
    width: 12px;
    height: 0;

    &-thumb {
      background: #7f7c87;
    }
  }
}

.footer {
  border-top: 1px solid #eeeeee;

  .vue-ui-dark-mode & {
    border-top-color: #1d2935;
  }
}
</style>
