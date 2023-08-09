import express from 'express'

import history from '../fixture/history.js'
import knowledge from '../fixture/knowledge.js'

import mimicReply from '../../src/share/mimic-reply.js'

const app = express()

app.post('/:chatId', (req, res) => {
  const payload = req.body

  const question = payload.question
  const chatId = req.params.chatId
  const mode = req.query.mode
  const messageId = Date.now().toString()

  console.log(payload)

  const { response } = knowledge(question)
  // split words, and then group with heading whitespace(s)

  history[chatId]?.history.push({
    messageId,
    question,
    answer: response,
    feedback: null
  })

  switch(mode) {
    case 'sse':
      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('connection', 'keep-alive')
      res.setHeader('Content-Type', 'text/event-stream')

      mimicReply(response, word => {
        res.write(`data: ${word}\n\n`)
      }).then(() => {
        res.write(`event: close\ndata: ${messageId}\n\n`)
        res.end()
      })

      break

    case 'xhr':
    default:
      res.json({ data: { response, messageId } })

  }

})

app.put('/:chatId/:messageId', (req, res) => {
  const messageId = req.params.messageId
  const feedback = req.body.feedback

  let chatId, index
  for(const _chatId in history) {
    const messages = history[_chatId]
    const _index = messages.history.findIndex(_ => _.messageId === messageId)
    if(_index >= 0) {
      chatId = _chatId
      index = _index
      break
    }
  }
  if(!chatId && !index) {
    res.status(404)
    res.json(null)
  }

  history[chatId].history[index].feedback = feedback
  res.json({ data: { feedback } })
})

export default app
