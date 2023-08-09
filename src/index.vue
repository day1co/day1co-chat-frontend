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
          @delete="() => {}"
          />
        <fcfc-chat v-show="route === 'chat'" :chats="chats" />
      </main>
      <fcfc-input @submit="ask" />
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
    history: [
      { id: 1, question: '몬스터 에너지 울트라 시트라' },
      { id: 2, question: '몬스터 에너지 파이프라인 펀치' },
    ],
    chats: []
  }),
  methods: {
    toggle() {
      this.opened = !this.opened
    },
    close() {
      this.opened = false
    },
    ask(question) {
      question = question.trim()
      if(!question)
        return
      this.route = 'chat'
      this.chats.push({ side: 'ours', content: question })
    }
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
