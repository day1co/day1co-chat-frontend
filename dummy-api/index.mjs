import http from 'http'
import fs from 'fs'

import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'

import history from './routes/history.mjs'
import chat from './routes/chat/index.mjs'

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(bodyParser.json())

///

app.use('/history', history)
chat(io)

///

server.listen(8012)
