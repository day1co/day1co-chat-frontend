<template>
  <nav class="fcfc-nav">
    <button class="fcfc-button fcfc-header-close" @click="close">
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
  methods: {
    close() {
      this.$root.close()
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

  z-index: 1

  > .fcfc-button
    margin: -1rem
    margin-left: auto
    padding: 1rem

</style>
