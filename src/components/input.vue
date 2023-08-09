<template>
  <form class="fcfc-input" @submit.prevent.stop>
    <div class="fcfc-input-wrap">
      <div
        class="fcfc-input-field"
        role="textbox"
        contenteditable
        @input=""
        placeholder="질문을 입력해보세요…"></div>
      <button class="fcfc-input-send" @click="send">
        <svg class="fcfc-icon" viewBox="0 0 24 24" fill="none" stroke="white">
          <path d="M12 5.5V19M7 10l5-5l5 5" />
        </svg>
      </button>
    </div>
  </form>
</template>

<script>

export default {
  props: {
    disabled: Boolean
  },
  data: () => ({
    value: ''
  }),
  methods: {
    update(e) {
      this.value = e.target.innerText
    },
    send() {
      this.$emit('submit', this.value)
    }
  }
}

</script>

<style lang="sass">

.fcfc-input
  position: sticky
  bottom: 0

  width: 100%

  padding: 1rem 1rem 1.5rem 1rem

  box-shadow: 0 -1px 0 #f2f2f2
  background: white

  &-wrap
    position: relative

  &-field
    appearance: none

    font-size: 0.875rem
    line-height: 1.5rem

    padding: 0.75rem 3.25rem 0.75rem 1rem
    border-radius: 1.5rem
    box-shadow: 0 0 0 1px #e6e8eb inset
    background-color: #f8f8f8

    resize: none

    transition: box-shadow 200ms ease

    &:focus
      outline: none
      box-shadow: 0 0 0 1px #444 inset

  &-send
    position: absolute
    right: 0.5rem
    bottom: 0.5rem

    padding: 0.25rem
    border-radius: 1rem

    background: #000 !important

    transition: background 200ms ease

    > svg
      vertical-align: top

  &-field:empty + &-send
    background: #d3d3d3 !important

</style>
