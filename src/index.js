import Vue from 'vue'
import App from './index.vue'

import './styles/index.sass'

export default function FloatingChat(mountAt, options = {}) {
  // App.el = mountAt
  const rootvm = new Vue(App)
  globalThis.rootvm = rootvm
  rootvm.options = Object.assign(rootvm.options, options)

  rootvm.$mount(mountAt)

  return {
    toggle() {
      rootvm.toggle()
    },
    setContext(context) {
      rootvm.$set(rootvm, 'context', context)
    },
    setOption(key, value) {
      rootvm.setOption(key, value)
    }
  }
}
