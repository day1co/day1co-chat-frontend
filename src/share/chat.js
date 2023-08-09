import api from './api'
import mimicReply from './mimic-reply'

export default class Chat {
  //
  constructor({ chatId, title } = {}) {
    this.chatId = chatId
    this.title = title ?? ''
    this.history = []
    this.status = 'loading'
    this.context = ''
  }

  async init(context = this.context) {
    this.context = context
    try {
      const payload = await api.history.create(context)
      this.chatId = payload.chatId
      this.status = ''
      return payload.chatId
    } catch(e) {
      this.status = 'error'
      throw e
    }
  }

  async load() {
    const payload = await api.history.get(this.chatId)

    this.title = payload.title
    this.history.push(...payload.history.map(h => ({
      ...h,
      feedback: h.feedback ?? null
    })))
    this.status = ''
  }

  prepare(question, override = {}) {
    const currentChat = {
      question,
      answer: '',
      messageId: null,
      feedback: '',
      ts: Date.now(),
      status: 'loading',
      ...override
    }
    this.history.push(currentChat)
    return currentChat
  }

  async ask(question = null, transport = 'xhr') {
    if(question)
      this.prepare(question)

    const currentChat = this.history[this.history.length - 1]
    console.log(JSON.stringify(this.history), currentChat.messageId)

    try {
      switch(transport) {
        case 'sse':
          const source = api.message.createEvent(this.chatId, question)
          const promise = new Promise()

          source.addEventListener('message', event => {
            currentChat.answer += ' ' + event.data
            currentChat.ts = Date.now()
          })
          source.addEventListener('close', event => {
            currentChat.messageId = event.data
            currentChat.status = ''
            promise.resolve()
          })

          source.stream()
          return promise

        case 'xhr':
        default:
          const payload = await api.message.ask(this.chatId, question)
          const { response, messageId } = payload

          await mimicReply(response, word => {
            currentChat.answer += ' ' + word
          }, 50)
          // keep this to feedback button hidden
          currentChat.messageId = messageId
          currentChat.status = ''
          break
      }
    } catch(e) {
      currentChat.status = 'error'
      throw e
    }
  }

  retry() {
    if(this.history.length) {
      const lastQuestion = (this.history.pop()).question
      return this.ask(lastQuestion)
    } else {
      // ??
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

  get initiated() {
    return this.chatId != null
  }
  get waiting() {
    return this.history[this.history.length - 1]?.status === 'loading'
  }
  get lastTimestamp() {
    return this.history[this.history.length - 1]?.ts
  }
}
