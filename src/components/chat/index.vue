<template>
  <div class="fcfc-chat">
    <ul class="fcfc-chat-list">
      <li class="fcfc-chat-history-loading" v-if="chat.status === 'loading'">
        <img class="fcfc-chat-loading" src="../../images/loading.svg" />
      </li>

      <li class="fcfc-chat-error theirs" v-else-if="chat.status === 'error'">
        <span> 대화를 생성하지 못했습니다. </span>
        <button class="fcfc-chat-retry" @click="retry">
          <span> 다시 시도 </span>
        </button>
      </li>

      <template v-for="message in chat.history" v-else>

        <li class="fcfc-chat-message ours">
          <span class="fcfc-chat-content">{{ message.question }}</span>
        </li>

        <li class="fcfc-chat-error theirs" v-if="message.status === 'error'">
          <span> 답변을 불러오지 못했습니다. </span>
          <button class="fcfc-chat-retry" @click="retry(message.messageId)">
            <span> 다시 시도 </span>
          </button>
        </li>

        <template v-else>
          <li class="fcfc-chat-message theirs">
            <component
              v-if="Array.isArray(message.answer)"
              v-for="answer in message.answer"
              :is="getComponent(answer)"
              :content="answer.contents ?? answer" />
            <component
              v-else
              :is="getComponent(message.answer)"
              :content="message.answer" />

            <img v-if="message.status === 'loading'" class="fcfc-chat-loading" src="../../images/loading.svg" />
          </li>

          <li class="fcfc-chat-feedback theirs" v-if="!message.status">
            <button
              v-for="[_feedback, label] of FEEDBACK"
              :class="[
                'fcfc-chat-feedback-button',
                _feedback,
                { active: message.feedback === _feedback }
              ]"
              :title="label"
              @click="feedback(message, _feedback)">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path stroke-width="1" d="M9.2 20H7.3v-8.5l4.5-7.3.4-.3c.2 0 .5.2.6.5l.1 4.6c0 .3.3.5.5.5h6.2a.9.9 0 0 1 .9 1.1L18 19.4c-.1.4-.5.7-.9.7h-8ZM4 20a.5.5 0 0 1-.5-.4v-7.3c0-.3.2-.5.5-.5H5v8.3H4Z" />
              </svg>
            </button>
          </li>
        </template>

      </template>

      <li class="fcfc-chat-open-qna theirs" v-if="!chat?.status && !lastMessage?.status && qnaLink">
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

import Chat from '../../share/chat.js'

import FcfcChatText from './text.vue'
import FcfcChatLinks from './links.vue'
import FcfcChatMarkdown from './markdown.vue'

export default {
  props: {
    chat: Chat,
    qnaLink: String,
    error: String
  },
  data: () => ({
    FEEDBACK: [
      [ 'LIKE', '좋아요' ],
      [ 'DISLIKE', '싫어요' ]
    ]
  }),
  methods: {
    async retry(messageId) {
      if(messageId != null)
        this.chat.retry(messageId)
      else
        this.$emit('retry')
    },
    async feedback(message, feedback) {
      if(!message.feedback)
        this.chat.feedback(message.messageId, feedback)
    },
    getComponent(answer) {
      switch(answer.type) {
        case 'links':
        case 'carousel':
          return FcfcChatLinks
        case 'markdown':
          return FcfcChatMarkdown
        default:
          return FcfcChatMarkdown
      }
    }
  },
  computed: {
    lastMessage() {
      return this.chat?.history?.[this.chat?.history.length - 1]
    }
  }
}

</script>

<style lang="sass">
@import ../../styles/variables

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

    > .fcfc-chat-content
      font-size: 0.875em

      ul, ol
        padding-left: 1em

      @include media('mobile')
        font-size: 1em
        line-height: 1.75em

    &.ours
      background-image: url('../../images/profile-ours.svg')
      background-position-x: calc(100% - 1em)

    &.theirs
      background-image: var(--fcfc-theme-chatbot-icon)
      background-position-x: 1em

    @include media('mobile')
      padding-top: 1.125em

  &-error
    display: flex
    padding: 0.75em 1em 0.75em 2.5em
    text-indent: -0.25em

    line-height: 1.5em

    background-color: #fff3f6
    background-image: url('../../images/alert.svg')
    background-size: 1.5em
    background-position: 1em 0.75em
    background-repeat: no-repeat

    span
      font-size: 0.875em

    > button
      color: #ed234b

      margin-left: auto
      padding-right: 1.25em

      background-image: url('../../images/retry.svg')
      background-size: 1em 1.5em
      background-position: right center
      background-repeat: no-repeat

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

  &-history-loading
    text-align: center
    padding-bottom: 1.5em
  &-loading
    width: 1.5em
    height: 1.375em
    vertical-align: top

</style>
