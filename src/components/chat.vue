<template>
  <div class="fcfc-chat">
    <ul class="fcfc-chat-list">
      <li class="fcfc-chat-history-loading" v-if="chat.loading">
        <img class="fcfc-chat-loading" src="../images/loading.svg" />
      </li>
      <template v-for="(message, index) in chat.history">
        <li class="fcfc-chat-message ours">
          {{ message.question }}
        </li>
        <li class="fcfc-chat-message theirs">
          {{ message.answer }}
          <img v-if="message.incomplete" class="fcfc-chat-loading" src="../images/loading.svg" />
        </li>
      </template>
    </ul>
  </div>
</template>

<script>

import Chat from '../share/chat.js'

export default {
  props: {
    chat: Chat
  }
}

</script>

<style lang="sass" scoped>

.fcfc-chat
  min-height: 100%

  background: white

  &-list
    margin: 0
    padding: 1.5rem 0 0 0

  &-message
    font-size: 0.8125rem
    line-height: 1.375rem

    padding: 0.75rem 1rem

    background-position-y: 0.75rem
    background-size: 1.5rem
    background-repeat: no-repeat

    &.ours
      text-align: right
      padding-right: 3rem

      background-image: url('../images/profile-ours.svg')
      background-position-x: calc(100% - 1rem)

    &.theirs
      padding-left: 3rem
      background-color: #f3f3f3

      background-image: url('../images/profile-theirs.svg')
      background-position-x: 1rem

  &-loading
    width: 1.5rem
    height: 1.375rem
    vertical-align: top

</style>
