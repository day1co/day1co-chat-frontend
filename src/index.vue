<template>
  <div class="fcfc-root">
    <div :class="[
      'fcfc-window',
      'fcfc-route-' + (route.path || 'main')
    ]" v-show="opened">

      <fcfc-nav />

      <main class="fcfc-content" ref="container" @scroll="updateScrollPosition">
        <transition name="fcfc-tr-fade">
          <fcfc-header
            v-show="!route.path"
            :title="currentChat?.title ?? route.path? '새로운 질문' : 'AI챗봇'" />
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
          :chats="currentChat" />
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
    context: {
      courseId: 200
    },
    chats: {
      /*

      */
    },
    scrollY: 0,
    lastSeen: -1
  }),
  methods: {
    async fetchHistory() {
      const payload = await api.history.get(this.context)
      for(const history of payload) {
        this.$set(this.chats, history.chatid, history)
      }
    },
    async addHistory(question) {
      const payload = await api.history.put(this.context, question)
      if(!payload) return
      this.history.push(payload)
    },
    async deleteHistory(id) {
      await api.history.delete(id)
      delete this.chats[id]
    },
    ///
    openHistory(id) {
      this.navigate('chat', { chatid: id })
      setTimeout(() => this.scrollToBottom(), 50)
    },
    ///
    async ask(question) {
      question = question.trim()
      if(!question || this.waiting)
        return

      if(!this.currentChat) {
        const chat = await api.history.put(this.context, question)
        this.$set(this.chats, chat.chatid, chat)
        this.navigate('chat', { chatid: chat.chatid })
      }

      const currentChat = {
        question,
        answer: '',
        ts: Date.now(),
        incomplete: true
      }

      const source = api.message.createEvent(this.context, question)

      source.addEventListener('message', event => {
        currentChat.answer += ' ' + event.data
        currentChat.ts = Date.now()
        setTimeout(() => this.scrollIfPossible(true), 50)
      })
      source.addEventListener('message', event => { // PLEASE IMPL THIS
        delete currentChat.incomplete
      })

      source.stream()

      this.chats[this.route.param.chatid].history.push(currentChat)
      this.route.path = 'chat'

      setTimeout(() => this.scrollToBottom(), 0)
    },
    ///
    updateScrollPosition() {
      const el = this.$refs.container
      this.scrollY = el.scrollHeight - (el.scrollTop + el.offsetHeight)

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
    ///
    toggle() {
      this.opened = !this.opened
    },
    close() {
      this.opened = false
    },
    navigate(to, param = {}) {
      this.route.path = to
      this.route.param = param
    }
  },
  computed: {
    waiting() {
      return this.lastItemCurrently?.incomplete
    },
    sticked() {
      return this.scrollY < 32
    },
    scrollRecommended() {
      return !this.sticked && this.lastSeen < this.lastItemCurrently?.ts
    },
    currentChat() {
      return this.chats[this.route.param?.chatid]
    },
    lastItemCurrently() {
      if(!this.currentChat) return
      return this.currentChat.history?.[this.currentChat.history?.length - 1]
    }
  },
  watch: {
    context() {
      this.fetchHistory()
    },
    route(to, from) {
      if(!to) {
        this.fetchHistory()
      }
    }
  },
  mounted() {
    this.fetchHistory()
  }
}

</script>

<style lang="sass" scoped>
@import styles/variables

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

    > *:not(.fcfc-header-close)
      opacity: 0
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

</style>
