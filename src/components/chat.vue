<template>
  <div class="fcfc-chat">
    <ul class="fcfc-chat-list">
      <li class="fcfc-chat-history-loading" v-if="chat.loading">
        <img class="fcfc-chat-loading" src="../images/loading.svg" />
      </li>
      <template v-for="(message, index) in chat.history">
        <li class="fcfc-chat-message ours">
          <span>{{ message.question }}</span>
        </li>
        <li class="fcfc-chat-message theirs">
          <span>{{ message.answer }}</span>
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
            @click="feedback(message.messageId, _feedback)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path stroke-width="1" d="M9.2 20H7.3v-8.5l4.5-7.3.4-.3c.2 0 .5.2.6.5l.1 4.6c0 .3.3.5.5.5h6.2a.9.9 0 0 1 .9 1.1L18 19.4c-.1.4-.5.7-.9.7h-8ZM4 20a.5.5 0 0 1-.5-.4v-7.3c0-.3.2-.5.5-.5H5v8.3H4Z" />
            </svg>
          </button>
        </li>
      </template>
      <li class="fcfc-chat-open-qna theirs" v-if="!lastMessage?.incomplete && qnaLink">
        <p class="label">
          더 궁금한 것이 있다면, 질의응답 게시판에서 질문해 보세요!
        </p>
        <a :href="qnaLink">
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
    chat: Chat,
    qnaLink: String
  },
  data: () => ({
    FEEDBACK: [
      [ 'LIKE', '좋아요' ],
      [ 'DISLIKE', '싫어요' ]
    ]
  }),
  methods: {
    async feedback(messageId, feedback) {
      this.chat.feedback(messageId, feedback)
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
@import ../styles/variables

.fcfc-chat
  min-height: 100%

  background: white

  &-list
    margin: 0
    padding: 1.5em 0 0 0

    > .ours
      text-align: right
      padding-right: 3em
      background-color: var(--fcfc-chat-background-ours)

    > .theirs
      padding-left: 3em
      background-color: var(--fcfc-chat-background-theirs)

  &-message
    padding: 1.25em 1em

    line-height: 1.5em

    background-position-y: 1.25em
    background-size: 1.5em
    background-repeat: no-repeat

    > span
      font-size: 0.875em

      @include media('mobile')
        font-size: 1em
        line-height: 1.75em

    &.ours
      background-image: url('../images/profile-ours.svg')
      background-position-x: calc(100% - 1em)

    &.theirs
      background-image: var(--fcfc-theme-chatbot-icon)
      background-position-x: 1em

    @include media('mobile')
      padding-top: 1.125em

  &-feedback
    display: flex
    justify-content: flex-end
    gap: 0.5em

    margin-top: -0.75em
    padding: 0 1em 1.25em 1em

    &-button
      width: 2em
      height: 2em

      margin: -0.25em
      padding: 0.25em

      color: #aaa

      transition: background-color 200ms ease

      &:hover
        background-color: #0001

      &:active
        background-color: #0002

      > svg
        fill: #aaa
        stroke: #aaa

      &.active > svg
        fill: #000
        stroke: #000

      &.LIKE
        //
      &.DISLIKE
        transform: rotate(180deg)

    &:has(.active) &-button:not(.active) > svg
      fill: #E6E8EB
      stroke: #C7C7C7

  &-open-qna
    border-top: 1px solid var(--fcfc-chat-section-border)
    padding: 0.75em 1em 1.25em 1em
    line-height: 1em

    > p
      font-size: 0.6875em
      margin: 0 0 0.5454em 0

    > a
      font-size: 0.8125em
      line-height: 1.85em

      color: #ed234b
      text-decoration: none

      > svg
        width: 1.23em
        vertical-align: -0.25em

    @include media('mobile')
      > p
        font-size: 0.8em
      > a
        font-size: 0.875em


  &-loading
    width: 1.5em
    height: 1.375em
    vertical-align: top

</style>
