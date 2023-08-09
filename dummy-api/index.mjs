import http from 'http'
import fs from 'fs'

import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(bodyParser.json())

///

const history = JSON.parse(fs.readFileSync('./fixture/history.json'))

const searchByContext = (query) =>
  Object
    .entries(history)
    .filter(([ id, record ]) => {
      for(const k in query)
        if(k in record.context && record.context[k] != query[k])
          return false
      return true
    }).map(([ id, record ]) =>
      ({ id, ...record })
    )

app.get('/history', (req, res) => {
  const context = req.query
  const records = searchByContext(context)

  res.json(records)
})

app.put('/history', (req, res) => {
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

app.delete('/history/:id', (req, res) => {
  const { id } = req.params
  delete history[id]
  res.json({})
})

///

io.on('connection', socket => {
  //
})

app.listen(8012)
