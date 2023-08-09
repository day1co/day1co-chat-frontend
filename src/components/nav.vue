<template>
  <nav class="fcfc-nav">
    <button class="fcfc-button fcfc-nav-back" @click="back">
      <svg class="fcfc-icon" viewBox="0 0 24 24">
        <path d="M14 6l-6 6l6 6"
          fill="none"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round" />
      </svg>
    </button>
    <label class="fcfc-nav-title">
      {{ title }}
    </label>
    <button class="fcfc-button fcfc-nav-close" @click="close">
      <svg class="fcfc-icon" viewBox="0 0 24 24">
        <path d="M7 7l10 10M7 17l10-10"
          fill="none"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round" />
      </svg>
    </button>
  </nav>
</template>

<script>

export default {
  props: {
    path: String,
    title: String
  },
  methods: {
    back() {
      this.$emit('navigate', '')
    },
    close() {
      this.$emit('close')
    }
  }
}

</script>

<style lang="sass" scoped>

.fcfc-nav
  position: absolute
  top: 0

  display: flex

  width: 100%
  height: 3.5rem

  padding: 1rem

  color: white
  background-color: #000

  transition: background-color 500ms linear

  z-index: 1

  > *
    // transition: opacity 500ms ease

  &-title
    font-size: 1rem
    line-height: 1.5rem
    font-weight: 700

    margin-left: 0.5rem

  > .fcfc-button
    margin: -1rem
    padding: 1rem

    &.fcfc-nav-close
      margin-left: auto

</style>
