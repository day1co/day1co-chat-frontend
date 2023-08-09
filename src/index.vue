<template>
  <div class="fcfc-root">
    <div :class="[
      'fcfc-window',
      'fcfc-route-' + (route || 'main')
    ]" v-show="opened">
      <fcfc-nav />
      <main class="fcfc-content">
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
    lastTheirsRef: null
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

      this.addHistory(question)

      if(!this.convid) {
        this.initateChat()
      }
      this.route = 'chat'
      this.chats.push({ side: 'ours', content: question })
      this.lastTheirsRef = { side: 'theirs', content: '', incomplete: true }
      this.chats.push(this.lastTheirsRef)

      this.socket.emit('chat', { question })
    }
  },
  computed: {
    waiting() {
      return this.lastTheirsRef?.incomplete
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

  background: #200
  box-shadow: 0 0.75rem 1rem rgba(0, 0, 0, 0.2)

  overflow: hidden

.fcfc-route-main::v-deep
  > .fcfc-nav
    background-color: transparent

    > *:not(.fcfc-header-close)
      opacity: 0

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
  margin-top: -12rem

</style>
