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
          @keydown.enter.prevent="send"
          @input="update"
          @compositionupdate="update"
          :disabled="disabled"
          :placeholder="disabled? '잠시만요…' : '질문을 입력해보세요…'">
        </textarea>
      </label>
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
    precompositiedValue: '',
    value: ''
  }),
  methods: {
    update(e) {
      this.precompositiedValue = this.value = e.target.value

      if(e instanceof CompositionEvent) {
        if(window.getSelection().type === 'Caret') {
          this.precompositiedValue += e.data
        }
      }
    },
    send(e) {
      console.log(e)
      if(!e.ctrlKey && !e.metaKey)
        return
      this.$emit('submit', this.value)
      this.precompositiedValue = this.value = ''
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
    display: grid
    vertical-align: top
    align-items: center
    position: relative

    font-size: 0.875rem
    line-height: 1.5rem


    transition: box-shadow 200ms ease

    &::after
      content: attr(data-value) ' '
      visibility: hidden
      white-space: pre-wrap

    &::after, > textarea
      box-sizing: border-box
      width: 100%
      height: 100%
      min-width: 1em
      grid-area: 1 / 1
      font: inherit

      resize: none
      background: none
      appearance: none
      border: none

      box-shadow: 0 0 0 1px #e6e8eb inset
      background-color: #f8f8f8

      padding: 0.75rem 3.25rem 0.75rem 1rem
      margin: 0
      border-radius: 1.5rem

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
