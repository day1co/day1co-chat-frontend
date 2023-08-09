import api from './api'

export default class Chat {
  //
  constructor({ chatid, title } = {}) {
    this.chatid = chatid
    this.title = title ?? ''
    this.history = []
    this.loading = true
  }

  async init(context) {
    const payload = await api.history.create(context)
    this.chatid = payload.chatid
    return payload.chatid
  }

  async load() {
    const payload = await api.history.get(this.chatid)
    this.title = payload.title
    this.history = Object.assign(this.history, payload.history)
    this.loading = false
  }

  ask(question) {
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
    })
    source.addEventListener('close', event => {
      currentChat.msgid = event.data
      currentChat.incomplete = false
    })

    source.stream()

    this.history.push(currentChat)
  }

  delete() {
    return api.history.delete(this.chatid)
  }

  async feedback(msgid, feedback) {
    const payload = await api.message.feedback(msgid, feedback)
    const index = this.history.findIndex(message.msgid === msgid)
    if(index < 0)
      throw new ReferenceError(`msgid ${msgid} couldn't found from history`)

    this.history[index].feedback = payload.feedback
    return payload.feedback
  }

  get waiting() {
    return this.history[this.history.length - 1]?.incomplete
  }
  get lastTimestamp() {
    return this.history[this.history.length - 1]?.ts
  }
}
