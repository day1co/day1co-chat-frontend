import api from './api'
import mimicReply from './mimic-reply'

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
    this.loading = false
    return payload.chatId
  }

  async load() {
    const payload = await api.history.get(this.chatId)

    this.title = payload.title
    this.history.push(...payload.history.map(h => ({
      ...h,
      feedback: h.feedback ?? null
    })))
    this.loading = false
  }

  async ask(question, transport = 'xhr') {
    const currentChat = {
      question,
      answer: '',
      messageId: null,
      feedback: '',
      ts: Date.now(),
      incomplete: true
    }
    this.history.push(currentChat)

    switch(transport) {
      case 'sse':
        const source = api.message.createEvent(this.chatId, question)

        source.addEventListener('message', event => {
          currentChat.answer += ' ' + event.data
          currentChat.ts = Date.now()
        })
        source.addEventListener('close', event => {
          currentChat.messageId = event.data
          currentChat.incomplete = false
        })

        source.stream()
        break

      case 'xhr':
      default:
        const payload = await api.message.ask(this.chatId, question)
        const { response, messageId } = payload

        await mimicReply(response, word => {
          currentChat.answer += ' ' + word
        }, 50)
        // keep this to feedback button hidden
        currentChat.messageId = messageId
        currentChat.incomplete = false
        break

    }
  }

  delete() {
    return api.history.delete(this.chatId)
  }

  async feedback(messageId, feedback) {
    const payload = await api.message.feedback(this.chatId, messageId, feedback)
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
