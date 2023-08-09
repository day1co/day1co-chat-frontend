<template>
  <section class="fcfc-history-empty" v-if="empty">
    <p class="fcfc-howto-title">
      이렇게 활용할 수 있어요!
    </p>
    <figure class="fcfc-howto-image">
      <img src="../images/howto-bg.jpg" />
      <figcaption>
        얼럴럴러
      </figcaption>
    </figure>
    <p class="fcfc-howto-text">
      디자인 도움 텍스트를 메꾸기 위한 연습텍스트입니다.
      <br />
      송고하지 마시고 킬 하십시요.
    </p>
  </section>
  <ul class="fcfc-list fcfc-list-history" v-else>
    <li class="fcfc-list-label"> 질문 기록 </li>
    <li class="fcfc-list-item" v-for="entry in history" @click="$emit('submit', entry.chatId)">
      <svg class="fcfc-icon" viewBox="-4 -4 24 24">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M11.5,11.5h-2l-1.5,2-1.5-2h-2c-1.1,0-2-.9-2-2V4.5c0-1.1,.9-2,2-2h7c1.1,0,2,.9,2,2v5c0,1.1-.9,2-2,2Z"/>
        <g fill="currentColor">
          <circle cx="5.5" cy="7" r=".75"/>
          <circle cx="8" cy="7" r=".75"/>
          <circle cx="10.5" cy="7" r=".75"/>
        </g>
      </svg>
      <label> {{ entry.title }} </label>
      <button class="fcfc-list-action" @click.stop="$emit('delete', entry.chatId)">
        <svg class="fcfc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M8 11v6c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6M14 10V8c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1v2M6 9.5h12M10.5 16v-4M13.5 16v-4" />
        </svg>
      </button>
    </li>
  </ul>
</template>

<script>

export default {
  props: {
    history: [Array, Object]
  },
  computed: {
    empty() {
      return (this.history.length ?? Object.keys(this.history).length) === 0
    }
  }
}

</script>

<style lang="sass">

@import ../styles/variables

.fcfc-list
  margin: 0
  padding: 1.5em 1em

  list-style: none

  background: var(--fcfc-background)

  &-label
    font-size: 0.6875em
    line-height: 1.45em

    color: var(--fcfc-foreground)
    opacity: 0.444444

    @include media('mobile')
      font-size: 0.75em
      line-height: 1.33em

  &-item
    @include clickable

    display: flex
    margin: 0.5em 0
    padding: 0.75em 0.75em 0.75em 0.5em
    border: 1px solid #e6e8eb
    border-radius: 0.375em

    background: #fff
    box-shadow: 0 0.2em 0.5em #202a4514

    transition: background 200ms ease, border-color 200ms ease

    > label
      font-size: 0.8125em
      line-height: 1.85em

      cursor: inherit

      @include media('mobile')
        font-size: 1em
        line-height: 1.5em

    &:hover
      background: #fff7f5
      border-color: #ffaa94


  &-flat > &-item
    background: #f2f2f2
    box-shadow: none

  &-action, &-icon
    vertical-align: top
    line-height: 0

  &-action
    margin: -0.875em -0.875em -0.875em auto
    padding: 0.75em 0.75em 0.75em 0.25em

    > svg
      width: 1.5em
      height: 1.5em

  &-history
    .fcfc-list
      &-item
        //

.fcfc-history-empty
  padding: 1em

  background: var(--fcfc-background)

.fcfc-howto

  &-title
    margin: 0.616rem 0
    font-size: 0.8125em
    line-height: 1.85em

  &-image
    @include unselectable

    position: relative
    margin: 0.5em 0

    > img
      width: 100%
      border-radius: 0.25em

    > figcaption
      display: flex
      justify-content: center
      align-items: center

      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      margin: auto
      padding: 0.444em

      width: 100%
      height: 100%

      color: white
      font-size: 1.125em
      line-height: 2.444em
      font-weight: bold

  &-text
    color: #6e6e73
    font-size: 0.75em
    line-height: 1.666em

</style>
