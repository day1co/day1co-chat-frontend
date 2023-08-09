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

app.get('/history', (req, res) => {
  const context = req.query
  const query = Object.entries(context)

  const records = Object.entries(history).filter(([id, record]) => {
    for(const [k, v] of query)
      if(record?.context?.[k] != v)
        return false

    return true
  }).map(([ id, record ]) => ({ id, ...record }))

  res.json(records)
})

app.put('/history', (req, res) => {
  const { question, context } = req.body
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
