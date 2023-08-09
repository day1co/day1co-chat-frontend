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

export default {}

</script>

<style lang="sass" scoped>

.fcfc-header
  position: relative
  display: flex
  flex-direction: row
  align-items: flex-end
  height: 12em

  padding: 1.5em

  border-start-start-radius: inherit
  border-start-end-radius: inherit

  &-logo
    position: absolute
    top: 1.5em
    left: 1em

    width: 2em
    height: 2em

  &-line
    margin: 0

    font-size: 1.25em
    line-height: 1.4em
    font-weight: bold
    color: #fff

  &-close
    position: absolute
    top: 1em
    right: 1em

</style>
