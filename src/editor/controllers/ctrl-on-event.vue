<template>
  <div class="ctrl-on-event">
    <el-cascader v-model="input" :options="options" @change="handleChange" style="width: 100%;"></el-cascader>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    events: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      input: null
    };
  },
  computed: {
    options() {
      const _opt = [];
      Object.keys(this.events).forEach(key => {
        const event = this.events[key];
        _opt.push({
          value: key,
          label: key,
          children: event.map(e => {
            return {
              value: e,
              label: e
            };
          })
        });
      });
      return _opt;
    }
  },
  watch: {
    input() {
      this.$emit("submit-update", this.input);
    }
  },
  created() {
    this.input = this.value;
  },
  methods: {
    handleChange() {}
  }
};
</script>
<style lang="scss" scoped>
.ctrl-ob-event {
  height: 100%;
}
</style>
