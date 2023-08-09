import Vue from 'vue'
import App from './index.vue'

import './styles/index.sass'

export default function FloatingChat(mountAt, options) {
  App.el = mountAt
  const rootvm = new Vue(App)
  globalThis.rootvm = rootvm

  return {
    toggle() {
      rootvm.toggle()
    },
    setContext(context) {
      rootvm.$set(rootvm, 'context', context)
    }
  }
}
