<template>
  <form class="fcfc-input" @submit.prevent.stop>
    <div class="fcfc-input-wrap">
      <label
        class="fcfc-input-field"
        role="textbox"
        ref="input"
        :data-value="precompositiedValue">
        <textarea
          rows="1"
          v-model="value"
          @keydown.enter="send"
          @input="update"
          @compositionupdate="update"
          :disabled="disabled"
          :placeholder="disabled? '잠시만요…' : '질문을 입력해보세요…'">
        </textarea>
      </label>
      <button :class="[
        'fcfc-input-send',
        { disabled: disabled || !value }
      ]" @click="send">
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
    precompositiedValue: '',
    value: ''
  }),
  methods: {
    update(e) {
      this.precompositiedValue = e.target.value
      this.value = e.target.value

      if(e instanceof CompositionEvent) {
        if(window.getSelection().type === 'Caret') {
          this.precompositiedValue += e.data
        }
      }
    },
    send(e) {
      if(e.key && !e.ctrlKey && !e.metaKey)
        return
      e.preventDefault()
      this.$emit('submit', this.value)
      this.$nextTick(() => {
        this.precompositiedValue = ''
        this.value = ''
      })
    }
  }
}

</script>

<style lang="sass">

@use 'sass:math'

.fcfc-input
  position: sticky
  bottom: 0

  width: 100%

  padding: 1em 1em 1.5em 1em

  box-shadow: 0 -1px 0 #f2f2f2
  background: white

  z-index: 2

  &-wrap
    position: relative

  &-field
    display: grid
    vertical-align: top
    align-items: center
    position: relative

    transition: box-shadow 200ms ease

    &::after
      content: attr(data-value) ' '
      visibility: hidden
      white-space: pre-wrap

    &::after, > textarea
      box-sizing: border-box
      width: 100%
      min-width: 1em * 1.1428
      height: 100%
      max-height: 6em * 1.1428
      grid-area: 1 / 1

      font: inherit
      font-size: 0.875em
      line-height: 1.5em * 1.1428

      resize: none
      background: none
      appearance: none
      border: none

      box-shadow: 0 0 0 1px #e6e8eb inset
      background-color: #f8f8f8

      padding: 0.75em * 1.1428 3.25em * 1.1428 0.75em * 1.1428 1em * 1.1428
      margin: 0
      border-radius: 1.5em * 1.1428

      transition: box-shadow 200ms ease

    > textarea
      &:focus, &:focus-visible
        outline: none !important
        box-shadow: 0 0 0 1px #444 inset


  &-send
    position: absolute
    right: 0.5em
    bottom: 0.5em

    padding: 0.25em
    border-radius: 1em

    background: #000 !important

    transition: background 200ms ease

    > svg
      vertical-align: top
      width: 1.5em
      height: 1.5em

    &.disabled
      background: #d3d3d3 !important

</style>
