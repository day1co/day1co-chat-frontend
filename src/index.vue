<template>
  <div class="fcfc-root">
    <div :class="[
      'fcfc-window',
      'fcfc-route-' + (route || 'main')
    ]" v-show="opened">
      <fcfc-nav />
      <main class="fcfc-content" ref="container" @scroll="updateScrollPosition">
        <transition name="fcfc-tr-fade">
          <fcfc-header v-show="!route" />
        </transition>
        <fcfc-history
          v-show="!route"
          :history="history"
          @submit="ask"
          @delete="deleteHistory"
          />
        <fcfc-chat v-show="route === 'chat'" :chats="chats" />
      </main>
      <fcfc-input
        @submit="ask"
        :disabled="waiting" />
      <transition name="fcfc-tr-fade" v-if="route === 'chat'">
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

import { io } from 'socket.io-client'

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
    route: '',
    opened: true,
    context: {
      courseId: 200
    },
    history: [],
    chats: [],
    socket: null,
    lastTheirsRef: null,
    scrollY: 0,
    lastSeen: -1
  }),
  methods: {
    async fetchHistory() {
      const payload = await api.history.get(this.context)
      this.$set(this, 'history', payload)
    },
    async addHistory(question) {
      const payload = await api.history.put(this.context, question)
      if(!payload) return
      this.history.push(payload)
    },
    async deleteHistory(id) {
      await api.history.delete(id)
      this.history = this.history.filter(_ => _.id !== id)
    },
    ///
    initateChat() {
      this.socket?.close()
      this.socket = new io()

      this.socket.on('create', data => {
        this.context.convid = data.convid
      })
      this.socket.on('chat', data => {
        this.lastTheirsRef ||= { side: 'theirs' }
        this.lastTheirsRef.msgid = data.msgid
        this.lastTheirsRef.content = data.response
        this.lastTheirsRef.incomplete = data.incomplete
        this.lastTheirsRef.ts = Date.now()

        this.scrollIfPossible(true)

        if(!data.incomplete) {
          setTimeout(() => this.scrollIfPossible(true), 50)
        }
      })
      this.socket.on('disconnect', () => {
        this.socket = null
        this.convid = null
      })

      this.socket.emit('create', this.context)
    },
    ///
    toggle() {
      this.opened = !this.opened
    },
    close() {
      this.opened = false
    },
    navigate(to) {
      this.route = to
    },
    ask(question) {
      question = question.trim()
      if(!question)
        return

      if(!this.convid) {
        this.addHistory(question)
        this.initateChat()
      }

      this.route = 'chat'
      this.chats.push({ side: 'ours', content: question })
      this.lastTheirsRef = {
        side: 'theirs',
        content: '',
        incomplete: true,
        ts: Date.now()
      }
      this.chats.push(this.lastTheirsRef)

      this.scrollToBottom()

      this.socket.emit('chat', { question })
    },
    ///
    updateScrollPosition() {
      const el = this.$refs.container
      this.scrollY = el.scrollHeight - (el.scrollTop + el.offsetHeight)

      if(this.sticked)
        this.lastSeen = Date.now()
    },
    scrollToBottom(instant = false) {
      this.$refs.container.lastChild.scrollIntoView({
        behavior: instant? 'instant' : 'smooth',
        block: 'end',
        inline: 'nearest'
      })
    },
    scrollIfPossible() {
      if(this.sticked)
        this.scrollToBottom(true)
    }
  },
  computed: {
    waiting() {
      return this.lastTheirsRef?.incomplete
    },
    sticked() {
      return this.scrollY < 32
    },
    scrollRecommended() {
      return !this.sticked && this.lastSeen < this.lastTheirsRef?.ts
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
  max-height: min(calc(100vh - 4rem), 37.5rem)

  border-radius: 1.5rem

  font-family: Pretendard, sans-serif

  background-color: #000
  background-image: url('./images/header.svg')
  background-size: contain
  background-position: top

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

  line-height: 1rem

  background: black
  color: white

  > svg
    width: 1rem
    height: 1rem

    vertical-align: top

</style>
