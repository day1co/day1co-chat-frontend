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
        <div class="fcfc-chat" v-show="route === 'chat'">
          <div class="fcfc-chat-list">
            <div class="fcfc-chat-message ours">
              피그마 어떻게 설치하나요?
            </div>
            <div class="fcfc-chat-message theirs">
              몬스터에너지울트라시트라!이이름은특이하게생긴프랑스자동차나스칸디나비아보드카에서온것은아닙니다.고대부터유래된과일시트론에서영감을받아태어난이제품은,레몬과비슷하지만더원초적이고투박합니다.마치몬스터에너지처럼요.이고대의과일과선조들에게서영감을얻은우리는전형적인드링크를새롭게해석한울트라시트라를만들었습니다.울트라시트라는새콤달콤한맛이입안에서잔잔하게퍼지며상쾌한맛으로마무리하죠.저칼로리에무설탕이지만몬스터에너지만의블렌드는변함없이가득담겨있답니다.
            </div>
          </div>
        </div>
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

export default {
  name: 'FloatingChat',
  components: {
    FcfcNav,
    FcfcHeader,
    FcfcHistory,
    FcfcInput
  },
  data: () => ({
    route: '',
    opened: true,
    history: [
      { id: 1, question: '몬스터 에너지 울트라 시트라' },
      { id: 1, question: '몬스터 에너지 파이프라인 펀치' },
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
      //
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

.fcfc-chat
  background: white

  &-message
    display: flex
    flex-direction: row
    justify-content: flex-start

    font-size: 0.8125rem
    line-height: 1.375rem

    padding: 0.75rem 1rem

    background-position-y: 0.75rem
    background-size: 1.5rem
    background-repeat: no-repeat

    &.ours
      flex-direction: row-reverse
      padding-right: 3rem

      background-image: url('./images/profile-ours.svg')
      background-position-x: calc(100% - 1rem)

    &.theirs
      padding-left: 3rem
      background-color: #f3f3f3

      background-image: url('./images/profile-theirs.svg')
      background-position-x: 1rem
 
.fcfc-tr-fade-enter-active, .fcfc-tr-fade-leave-active
  transition: opacity 250ms, margin-top 250ms

.fcfc-tr-fade-enter, .fcfc-tr-fade-leave-to
  opacity: 0
  margin-top: -12rem

</style>
