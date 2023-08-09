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
    <li class="fcfc-list-item" v-for="entry in history" @click="$emit('submit', entry.chatid)">
      {{ entry.title }}
      <button class="fcfc-list-action" @click.stop="$emit('delete', entry.chatid)">
        <img class="fcfc-icon" src="../images/trash.svg" />
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
  padding: 1rem 1rem

  list-style: none

  background: white

  &-label
    font-size: 0.6875rem
    line-height: 1rem

    color: #6e6e73

  &-item
    @include clickable

    display: flex
    margin: 0.5rem 0
    padding: 0.75rem
    border: 1px solid #e6e8eb
    border-radius: 0.375rem

    font-size: 0.8125rem
    line-height: 1.5rem

    box-shadow: 0 0.2rem 0.5rem #202a4514

  &-flat > &-item
    background: #f2f2f2
    box-shadow: none

  &-action, &-icon
    vertical-align: top
    line-height: 0

  &-action
    margin: -0.875rem -0.875rem -0.875rem auto
    padding: 0.75rem 0.75rem 0.75rem 0.25rem

  &-history

    .fcfc-list

      &-item
        padding-left: 2rem
        background-image: url('../images/comment.svg')
        background-repeat: no-repeat
        background-size: 1.5rem
        background-position: 0.5rem center

.fcfc-history-empty
  padding: 1rem

  background: white

.fcfc-howto

  &-title
    margin: 0.5rem 0
    font-size: 0.8125rem
    line-height: 1.5rem

  &-image
    @include unselectable

    position: relative
    margin: 0.5rem 0

    > img
      width: 100%
      border-radius: 0.25rem

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
      padding: 0.5rem

      width: 100%
      height: 100%

      color: white
      font-size: 1.125rem
      line-height: 2.75rem
      font-weight: bold

  &-text
    color: #6e6e73
    font-size: 0.75rem
    line-height: 1.25rem

</style>
