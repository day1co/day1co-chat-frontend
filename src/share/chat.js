import api from './api'
import mimicReply from './mimic-reply'

export default class Chat {
  //
  constructor(chat = {}) {
    this.initParams(chat)
    this.history = []
    this.status = 'loading'
    this.context = ''
  }

  initParams(payload) {
    this.chatId = payload.chatId ?? payload.conversationId
    this.title = (payload.title || payload.createdAt) ?? this.title
  }

  async init(context = this.context) {
    this.context = context
    this.status = 'loading'
    try {
      const payload = await api.history.create(context)
      this.initParams(payload)
      this.status = ''
      return payload.chatId
    } catch(e) {
      this.status = 'error'
      throw e
    }
  }

  async load() {
    const payload = await api.history.get(this.chatId)

    this.title = payload.title || payload.createdAt
    this.history.push(...payload.history?.map(h => ({
      ...h,
      feedback: h.feedback ?? null
    })) ?? [])
    this.status = ''
  }

  prepare(question, override = {}) {
    const message = {
      question,
      answer: '',
      messageId: null,
      feedback: '',
      ts: Date.now(),
      status: 'loading',
      ...override
    }
    this.history.push(message)
    return message
  }

  async ask(question = null, transport = 'xhr') {
    if(question != null)
      this.prepare(question)

    const message = this.history[this.history.length - 1]

    try {
      switch(transport) {
        case 'sse':
          return new Promise((resolve, reject) => {
            const source = api.message.createEvent(this.chatId, message.question)

            source.addEventListener('message', event => {
              message.answer += ' ' + event.data
              message.ts = Date.now()
            })
            source.addEventListener('close', event => {
              message.messageId = event.data
              message.status = ''
              resolve()
            })
            source.addEventListener('error', event => {
              reject(event)
            })

            source.stream()
          })

        case 'xhr':
        default:
          const payload = await api.message.ask(this.chatId, message.question)
          const { response, messageId } = payload

          message.answer = []
          await mimicReply(response, message, 50)
          // keep this to feedback button hidden
          message.messageId = messageId
          message.status = ''
      }
    } catch(e) {
      message.status = 'error'
      throw e
    }
  }

  retry(messageId) {
    if(this.waiting)
      return
    const index = this.history.findIndex(message => message.messageId === messageId)
    const [ message ] = this.history.splice(index, 1)
    return this.ask(message.question)
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
