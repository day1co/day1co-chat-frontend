import http from 'http'
import fs from 'fs'

import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'

import history from './routes/history.mjs'
import message from './routes/message.mjs'

const app = express()
app.use(bodyParser.json())

///

app.use('/history', history)
app.use('/message', message)

///

app.listen(8012)
