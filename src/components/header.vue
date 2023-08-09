<template>
  <header class="fcfc-header">
    <p class="fcfc-header-line">
      안녕하세요👋
      <br />
      AI챗봇에게 궁금한 것을 물어보세요
    </p>
  </header>
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

.fcfc-header
  position: relative
  display: flex
  flex-direction: row
  align-items: flex-end
  height: 12rem

  padding: 1.5rem

  border-start-start-radius: inherit
  border-start-end-radius: inherit

  &-logo
    position: absolute
    top: 1.5rem
    left: 1rem

    width: 2rem
    height: 2rem

  &-line
    margin: 0

    font-size: 1.25rem
    line-height: 1.75rem
    font-weight: bold
    color: #fff

  &-close
    position: absolute
    top: 1rem
    right: 1rem

</style>
