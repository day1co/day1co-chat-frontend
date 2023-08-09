import express from 'express'

import history from '../fixture/history.mjs'
import knowledge from '../fixture/knowledge.mjs'

const app = express()

app.post('/', (req, res) => {
  const payload = req.body

  const question = payload.question
  const chatid = payload.chatid
  const msgid = Date.now()

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

  const timer = setInterval(() => {
    const word = words.shift()?.replaceAll(/[\r\n\t\v]/g, ' ')
    if(!word) {
      res.write(`event: close\ndata: ${msgid}\n\n`)
      return clearTimeout(timer)
    }
    res.write(`data: ${word}\n\n`)
  }, 100)

})

export default app
