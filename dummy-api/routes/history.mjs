import fs from 'fs'

import searchKnowledge from '../search-knowledge.mjs'

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
app.use(bodyParser.json())

const history = JSON.parse(fs.readFileSync('./fixture/history.json'))

const searchByContext = (query) =>
  Object
    .entries(history)
    .filter(([ chatid, record ]) => {
      for(const k in query)
        if(k in record.context
        && k !== 'chatid'
        && record.context[k] != query[k])
          return false
      return true
    }).map(([ chatid, record ]) =>
      ({ chatid, ...record })
    )

const fillAnswer = history => history.map(entry => ({
  question: entry.question,
  answer: entry.answer ?? searchKnowledge(entry.question).response
}))

//
app.get('/', (req, res) => {
  const context = req.query
  const records = searchByContext(context)

  const result = records.map(({ chatid, title, context, history }) => ({
    chatid,
    title,
    context
    // omit history (just for mimicking prod api)
  }))

  res.json(result)
})

// Create new chat session
app.put('/', (req, res) => {
  const { question, context } = req.body
  // const duplicated = searchByContext(context).find(entry => question === entry.question)

  // if(duplicated) {
  //   res.status(409)
  //   res.json(duplicated)
  //   return
  // }

  const chatid = 1 + Math.max(...Object.keys(history))

  history[chatid] = { context, history: [] }

  res.json({ chatid, ...history[chatid] })
})

// Load chat history
app.get('/:chatid', (req, res) => {
  const chatid = req.params.chatid
  const entry = history[chatid]
  if(!entry) {
    res.status(404)
    res.end()
    return
  }
  entry.history = fillAnswer(entry.history)
  res.json(entry)
})

app.delete('/:id', (req, res) => {
  const { id } = req.params
  delete history[id]
  res.json({})
})

///

export default app
