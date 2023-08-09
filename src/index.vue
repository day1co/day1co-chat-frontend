<template>
  <div
    class="fcfc-root"
    :style="{ '--y': scrollTop }">
    <div :class="[
      'fcfc-window',
      'fcfc-route-' + (route.path || 'main')
    ]" v-show="opened">

      <img
        class="fcfc-logo"
        v-show="route.path === ''"
        src="./images/fastcampus.svg">

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
          새 메시지
        </button>
      </transition>
    </div>
    <div class="fcfc-dim" v-show="opened"></div>
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
    options: {},
    context: {
      courseId: 200
    },
    chats: {},
    scrollTop: 0,
    scrollBottom: 0,
    lastSeen: -1
  }),
  provide() {
    return {
      options: this.options
    }
  },
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
      this.$refs.container?.lastChild?.scrollIntoView({
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

      if(to === 'chat' && 'chatid' in param) {
        this.currentChat.load().then(() => this.scrollToBottom())
      }
      if(to === '') {
        this.listChat()
      }
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
    this.listChat()
  }
}

</script>

<style lang="sass" scoped>
@import styles/variables

$bp: 96
$scale: "(var(--y) / #{$bp})"
$rscale: "(1 - var(--y) / #{$bp})" // sass sucks

.fcfc-window
  display: flex
  flex-direction: column

  position: relative

  width: 21.25rem
  height: min(calc(100vh - 4rem), 37.5rem)

  border-radius: 1.5rem

  font-family: Pretendard, sans-serif

  background-color: #fff
  background-image: url('./images/header.svg')
  background-size: contain
  background-position: top
  background-repeat: no-repeat

  box-shadow: 0 0.75rem 1rem rgba(0, 0, 0, 0.2)

  overflow: hidden

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
    margin-top: -3.5rem

.fcfc-content
  margin-top: 3.5rem
  max-height: calc(100% - 5.5rem)
  overflow-x: hidden
  overflow-y: auto

  flex-grow: 1

//

.fcfc-tr-fade-enter-active, .fcfc-tr-fade-leave-active
  transition: opacity 250ms, margin-top 250ms

.fcfc-tr-fade-enter, .fcfc-tr-fade-leave-to
  opacity: 0

  &.fcfc-header
    margin-top: -12rem !important

.fcfc-tr-fade-enter-to
  opacity: 1

.fcfc-scroll-to-bottom
  position: absolute
  right: 0
  bottom: 6.25rem
  left: 0

  display: inline-block
  width: 8rem

  margin: 0 auto
  padding: 0.5rem
  border-radius: 1rem

  font-size: 0.8125rem
  line-height: 1rem

  background: black
  color: white

  > svg
    width: 1rem
    height: 1rem

    vertical-align: top

///

.fcfc-logo
  position: absolute
  top: max(1rem, min(2rem, calc(1rem + #{$rscale} * 1rem)))
  left: max(1rem, min(1.5rem, calc(1rem + #{$rscale} * 0.5rem)))
  width: max(1.5rem, min(2rem, calc(1.5rem + #{$rscale} * 0.5rem)))

</style>
