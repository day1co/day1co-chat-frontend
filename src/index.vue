<template>
  <div
    class="fcfc-root theme-zerobase"
    :style="{ '--y': scrollTop }">
    <div :class="[
      'fcfc-window',
      'fcfc-route-' + (route.path || 'main')
    ]" v-show="opened">

      <fcfc-nav
        :path="route.path"
        :title="title"
        @navigate="navigate"
        @close="close" />

      <main class="fcfc-content" ref="container" @scroll="updateScrollPosition">
        <transition name="fcfc-tr-fade">
          <fcfc-header v-show="!route.path" />
        </transition>
        <fcfc-history
          v-show="!route.path"
          :history="chats"
          @submit="openHistory"
          @delete="deleteHistory"
          />
        <fcfc-chat
          v-show="route.path === 'chat'"
          v-if="currentChat"
          :chat="currentChat"
          :qna-link="options.qna" />
      </main>

      <fcfc-input
        @submit="ask"
        :disabled="waiting" />

      <transition name="fcfc-tr-fade" v-if="route.path === 'chat'">
        <button
          class="fcfc-scroll-to-bottom"
          v-show="scrollRecommended"
          @click="scrollToBottom()">
          <svg viewBox="0 0 16 16">
            <path d="M8 2v12M2 8l6 6l6-6" fill="none" stroke="white" />
          </svg>
          <label>새 메시지</label>
        </button>
      </transition>
    </div>

    <button class="fcfc-fab-toggle" @click.prevent="toggle">
      <svg v-if="opened" viewBox="0 0 24 16" class="fcfc-fab-toggle-close">
        <path d="M4 4l8 8l8-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <template v-else>AI챗봇</template>
    </button>

    <div class="fcfc-dim" v-show="opened" @click="close"></div>
  </div>
</template>

<script>

import FcfcNav from './components/nav.vue'
import FcfcHeader from './components/header.vue'
import FcfcHistory from './components/history.vue'
import FcfcInput from './components/input.vue'
import FcfcChat from './components/chat.vue'

import api from './share/api.js'
import Chat from './share/chat.js'

export default {
  name: 'FloatingChat',
  components: {
    FcfcNav,
    FcfcHeader,
    FcfcHistory,
    FcfcInput,
    FcfcChat
  },
  data: () => ({
    route: {
      path: '',
      param: {}
    },
    opened: true,
    options: {
      qna: null,
      endpoint: null
    },
    context: {
      courseId: 200
    },
    chats: {},
    scrollTop: 0,
    scrollBottom: 0,
    lastSeen: -1
  }),
  methods: {
    async listChat() {
      const chats = await api.history.list(this.context)
      for(const chat of chats) {
        this.$set(this.chats, chat.chatid, new Chat(chat))
      }
    },
    async openHistory(chatid) {
      this.navigate('chat', { chatid })
    },
    async deleteHistory(chatid) {
      this.chats[chatid].delete()
      this.$delete(this.chats, chatid)
    },
    ///
    async ask(question) {
      if(!this.currentChat) {
        const chat = new Chat()
        const chatid = await chat.init(this.context)

        this.$set(this.chats, chatid, chat)
        this.navigate('chat', { chatid })
      }

      this.currentChat.ask(question)
    },
    ///
    updateScrollPosition() {
      const el = this.$refs.container
      this.scrollTop = el.scrollTop
      this.scrollBottom = el.scrollHeight - (el.scrollTop + el.offsetHeight)

      if(this.sticked)
        this.lastSeen = Date.now()
    },
    scrollToBottom(instant = false) {
      this.$refs.container?.lastChild?.scrollIntoView?.({
        behavior: instant? 'instant' : 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    },
    scrollIfPossible() {
      if(this.sticked)
        this.scrollToBottom(true)
    },
    navigate(to, param = {}) {
      this.route.path = to
      this.route.param = param

      if(to === 'chat' && 'chatid' in param)
        this.currentChat.load().then(() => this.scrollToBottom())

      if(to === '')
        this.listChat()
    },
    ///
    setOption(key, value) {
      this.$set(this.options, key, value)
    },
    toggle() {
      this.opened = !this.opened
    },
    close() {
      this.opened = false
    }
  },
  computed: {
    title() {
      return this.currentChat?.title ?? 'AI챗봇'
    },
    waiting() {
      return this.currentChat?.waiting
    },
    sticked() {
      return this.scrollBottom < 32
    },
    scrollRecommended() {
      return !this.sticked && this.lastSeen < this.currentChat?.lastTimestamp
    },
    currentChat() {
      if(this.route.path !== 'chat')
        return null
      return this.chats[this.route.param?.chatid]
    }
  },
  watch: {
    context() {
      this.listChat()
    },
    options: {
      handler(to) {
        if(to?.endpoint)
          api.setEndpoint(to.endpoint)
      },
      deep: true
    },
    ['currentChat.history']: {
      handler() {
        this.scrollIfPossible()
      },
      deep: true
    },
    ['currentChat.waiting'](to) {
      if(!to) {
        setTimeout(() => this.scrollIfPossible(), 50)
      }
    }
  },
  mounted() {
    api.setEndpoint(this.options?.endpoint)
    this.listChat()
  }
}

</script>

<style lang="sass" scoped>
@import styles/variables

$bp: 96
$scale: "(var(--y) / #{$bp})"
$rscale: "(1 - var(--y) / #{$bp})" // sass sucks

.fcfc-root
  position: fixed
  right: 0
  bottom: 0

  display: flex
  flex-direction: column
  align-items: flex-end
  justify-content: flex-end

  font-family: Pretendard, sans-serif
  font-size: 16px

  max-height: calc(100% - 6em)

  z-index: 100000

  @include media('mobile')
    width: 100%

.fcfc-window
  display: flex
  flex-direction: column

  position: relative

  width: 21.25em
  height: 100%

  margin: 0 1.5em
  border-radius: 1.5em

  color: var(--fcfc-foreground)

  background-color: var(--fcfc-background)
  background-image: var(--fcfc-theme-header)
  background-size: contain
  background-position: top
  background-repeat: no-repeat

  box-shadow: 0 0.75em 1em rgba(0, 0, 0, 0.2)

  overflow: hidden
  z-index: 2

  @include media('mobile')
    width: 100%
    margin: 0 0 -5.5em 0
    border-bottom-right-radius: 0
    border-bottom-left-radius: 0

.fcfc-route-main::v-deep
  > .fcfc-nav
    background-color: transparent

    > .fcfc-nav-back
      opacity: 0
      pointer-events: none

    > .fcfc-nav-title
      opacity: calc(#{$scale})
      pointer-events: none

  > .fcfc-content > .fcfc-header
    margin-top: -3.5em

  &::before
    display: block
    content: ''

    position: absolute
    top: max(1em, min(2em, calc(1em + #{$rscale} * 1em)))
    left: max(1em, min(1.5em, calc(1em + #{$rscale} * 0.5em)))
    width: max(1.5em, min(2em, calc(1.5em + #{$rscale} * 0.5em)))
    height: max(1.5em, min(2em, calc(1.5em + #{$rscale} * 0.5em)))

    background-image: var(--fcfc-theme-logo)
    background-size: cover
    background-repeat: no-repeat


.fcfc-content
  margin-top: 3.5em
  max-height: calc(100% - 5.5em)
  overflow-x: hidden
  overflow-y: auto
  overscroll-behavior: contain

  flex-grow: 1

//

.fcfc-tr-fade-enter-active, .fcfc-tr-fade-leave-active
  transition: opacity 250ms, margin-top 250ms

.fcfc-tr-fade-enter, .fcfc-tr-fade-leave-to
  opacity: 0

  &.fcfc-header
    margin-top: -12em !important

.fcfc-tr-fade-enter-to
  opacity: 1

.fcfc-scroll-to-bottom
  position: absolute
  right: 0
  bottom: 6.25em
  left: 0

  display: inline-block
  width: 8em

  margin: 0 auto
  padding: 0.5em
  border-radius: 1em

  line-height: 1em

  background: black
  color: white

  > label
    font-size: 0.8125em

  > svg
    width: 1em
    height: 1em

    vertical-align: top

///
.fcfc-dim
  @include media('mobile')
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh

    background: #0006

.fcfc-fab-toggle
  width: 7em
  margin: 1em 1.5em 1.5em auto
  padding: 1em 0
  border-radius: 1.5em

  color: var(--fcfc-fab-foreground)
  background: var(--fcfc-fab-background)
  box-shadow: 0 0.7em 1em #0003

  line-height: 1em
  text-align: center
  font-weight: 700

  z-index: 1

  &-close
    width: 1.5em
    height: 1rem
    vertical-align: top

</style>
