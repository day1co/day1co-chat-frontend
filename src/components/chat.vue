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
        <li class="fcfc-chat-feedback theirs">
          <button
            v-for="[_feedback, label] of FEEDBACK"
            :class="[
              'fcfc-chat-feedback-button',
              _feedback,
              { active: message.feedback === _feedback }
            ]"
            :title="label"
            @click="feedback(message.msgid, _feedback)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
              <path fill="currentColor" d="M11.3 5.2c.5-.8 1.8-.5 1.8.5l.2 3.6h5a1.4 1.4 0 0 1 1.4 1.7l-2 7.2a1.4 1.4 0 0 1-1.3 1H7.5v-8l3.8-6Zm-4.8 6H5.2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1.3v-8Z"/>
            </svg>
          </button>
        </li>
      </template>
      <li class="fcfc-chat-open-qna theirs" v-if="!lastMessage?.incomplete">
        <p class="label">
          더 궁금한 것이 있다면, 질의응답 게시판에서 질문해 보세요!
        </p>
        <a href="#whatever">
          질의응답 게시판<!--
       --><svg viewBox="0 0 16 16">
            <path
              d="M7 4l4 4l-4 4"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>

import Chat from '../share/chat.js'

export default {
  props: {
    chat: Chat
  },
  data: () => ({
    FEEDBACK: [
      [ 'like', '좋아요' ],
      [ 'dislike', '싫어요' ]
    ]
  }),
  methods: {
    async feedback(msgid, feedback) {
      this.chat.feedback(msgid, feedback)
    }
  },
  computed: {
    lastMessage() {
      return this.chat?.history?.[this.chat?.history.length - 1]
    }
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

    > .ours
      text-align: right
      padding-right: 3rem

    > .theirs
      padding-left: 3rem
      background-color: #f3f3f3

  &-message
    font-size: 0.875rem
    line-height: 1.5rem

    padding: 1.25rem 1rem

    background-position-y: 1.25rem
    background-size: 1.5rem
    background-repeat: no-repeat

    &.ours
      background-image: url('../images/profile-ours.svg')
      background-position-x: calc(100% - 1rem)

    &.theirs
      background-image: url('../images/profile-theirs.svg')
      background-position-x: 1rem

  &-feedback
    display: flex
    justify-content: flex-end
    gap: 0.5rem

    margin-top: -0.75rem
    padding: 0 1rem 1.25rem 1rem

    &-button
      width: 1.5rem
      height: 1.5rem
      padding: 0

      color: #aaa

      transition: background-color 200ms ease

      &:hover
        background-color: #0001

      &:active
        background-color: #0002

      &.active
        color: #ed234b

      &.like
        //
      &.dislike
        transform: rotate(180deg)

  &-open-qna
    border-top: 1px solid #e6e8eB
    padding: 0.75rem 1rem 1.25rem 1rem

    > p
      font-size: 0.6875rem
      line-height: 1rem
      margin: 0 0 0.375rem 0

    > a
      font-size: 0.8125rem
      line-height: 1.5rem

      color: #ed234b
      text-decoration: none

      > svg
        width: 1rem
        vertical-align: -0.25rem


  &-loading
    width: 1.5rem
    height: 1.375rem
    vertical-align: top

</style>
