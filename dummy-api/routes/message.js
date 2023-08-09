import express from 'express'

import history from '../fixture/history.js'
import knowledge from '../fixture/knowledge.js'

const app = express()

app.post('/', (req, res) => {
  const payload = req.body

  const question = payload.question
  const chatId = payload.chatId
  const messageId = Date.now().toString()

  console.log(payload)

  res.statusCode = 200
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('connection', 'keep-alive')
  res.setHeader('Content-Type', 'text/event-stream')

  const match = knowledge(question)
  // split words, and then group with heading whitespace(s)
  const words = match.response
    .split(/(\s+)/)
    .reduce((p, c, i, l) =>
      i % 2? p
        : i? [...p, l[i - 1] + c]
           : [c],
    [])

  history[chatId]?.history.push({
    messageId,
    question,
    answer: match.response,
    feedback: null
  })

  const timer = setInterval(() => {
    const word = words.shift()?.replaceAll(/[\r\n\t\v]/g, ' ')
    if(!word) {
      res.write(`event: close\ndata: ${messageId}\n\n`)
      return clearTimeout(timer)
    }
    res.write(`data: ${word}\n\n`)
  }, 100)

})

app.put('/:messageId', (req, res) => {
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
