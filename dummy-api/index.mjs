import http from 'http'

import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'

import history from './routes/history.mjs'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(bodyParser.json())

///

app.use('/history', history)

///

io.on('connection', socket => {
  //
})

app.listen(8012)
