<template>
  <div>
    <svg
      :class="{'is-active':isActive}"
      t="1492500959545"
      class="hamburger"
      style
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="1691"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="64"
      height="64"
      @click="toggleClick"
    >
      <path
        d="M810.666667 149.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667V192c0-23.466667-19.2-42.666667-42.666666-42.666667zM810.666667 405.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667v-128c0-23.466667-19.2-42.666667-42.666666-42.666667zM810.666667 661.333333H213.333333c-23.466667 0-42.666667 19.2-42.666666 42.666667v128c0 23.466667 19.2 42.666667 42.666666 42.666667h597.333334c23.466667 0 42.666667-19.2 42.666666-42.666667v-128c0-23.466667-19.2-42.666667-42.666666-42.666667z"
        fill="#D1C4E9"
        p-id="5077"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
};
</script>

<style scoped>
.hamburger {
  display: inline-block;
  cursor: pointer;
  width: 20px;
  height: 20px;
  transform: rotate(90deg);
  transition: 0.38s;
  transform-origin: 50% 50%;
}
.hamburger.is-active {
  transform: rotate(0deg);
}
</style>
