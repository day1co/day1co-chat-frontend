import fs from 'fs'

import express from 'express'

const app = express()

const history = JSON.parse(fs.readFileSync('./fixture/history.json'))

const searchByContext = (query) =>
  Object
    .entries(history)
    .filter(([ id, record ]) => {
      for(const k in query)
        if(k in record.context && k !== 'convid' && record.context[k] != query[k])
          return false
      return true
    }).map(([ id, record ]) =>
      ({ id, ...record })
    )

app.get('/', (req, res) => {
  const context = req.query
  const records = searchByContext(context)

  res.json(records)
})

app.put('/', (req, res) => {
  const { question, context } = req.body
  const duplicated = searchByContext(context).find(entry => question === entry.question)

  if(duplicated) {
    res.status(409)
    res.json(duplicated)
    return
  }

  const id = 1 + Math.max(...Object.keys(history))

  history[id] = { question, context }

  res.json({ id, ...history[id] })
})

app.delete('/:id', (req, res) => {
  const { id } = req.params
  delete history[id]
  res.json({})
})

///

export default app
