import api from './api'

export default class Chat {
  //
  constructor({ chatId, title } = {}) {
    this.chatId = chatId
    this.title = title ?? ''
    this.history = []
    this.loading = true
  }

  async init(context) {
    const payload = await api.history.create(context)
    this.chatId = payload.chatId
    return payload.chatId
  }

  async load() {
    const payload = await api.history.get(this.chatId)
    this.title = payload.title
    this.history.push(...payload.history.map(h => ({ ...h, feedback: h.feedback ?? null })))
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
      currentChat.messageId = event.data
      currentChat.incomplete = false
    })

    source.stream()

    this.history.push(currentChat)
  }

  delete() {
    return api.history.delete(this.chatId)
  }

  async feedback(messageId, feedback) {
    const payload = await api.message.feedback(messageId, feedback)
    const index = this.history.findIndex(message => message.messageId === messageId)
    if(index < 0)
      throw new ReferenceError(`messageId ${messageId} couldn't found from history`)

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
