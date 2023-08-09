import history from '../fixture/history.js'
import knowledge from '../fixture/knowledge.js'

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

const searchByContext = (query) =>
  Object
    .entries(history)
    .filter(([ chatId, record ]) => {
      for(const k in query)
        if(k in record.context
        && k !== 'chatId'
        && record.context[k] != query[k])
          return false
      return true
    }).map(([ chatId, record ]) =>
      ({ chatId, ...record })
    )

const fillAnswer = history => history.map(entry => ({
  ...entry,
  question: entry.question,
  answer: entry.answer ?? knowledge(entry.question).response
}))

//
app.get('/', (req, res) => {
  const context = req.query
  const records = searchByContext(context)

  const result = records.map(({ chatId, title, context, history }) => ({
    chatId,
    title,
    context
    // omit history (just for mimicking prod api)
  }))

  res.json({ data: result })
})

// Create new chat session
app.post('/', (req, res) => {
  const { context } = req.body
  // const duplicated = searchByContext(context).find(entry => question === entry.question)

  // if(duplicated) {
  //   res.status(409)
  //   res.json(duplicated)
  //   return
  // }

  const chatId = 1 + Math.max(...Object.keys(history)) ?? 0

  history[chatId] = {
    context,
    title: '제목 없는 대화',
    history: []
  }

  res.json({ data: { chatId, ...history[chatId] } })
})

// Load chat history
app.get('/:chatId', (req, res) => {
  const chatId = req.params.chatId
  const entry = history[chatId]
  if(!entry) {
    res.status(404)
    res.end()
    return
  }

  entry.history = fillAnswer(entry.history)
  res.json({ data: entry })
})

app.delete('/:id', (req, res) => {
  const { id } = req.params
  delete history[id]
  res.json({ data: {} })
})

///

export default app
