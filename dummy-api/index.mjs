import * as url from 'node:url'

import express from 'express'
import { Server } from 'socket.io'
import bodyParser from 'body-parser'

import history from './routes/history.mjs'
import message from './routes/message.mjs'

const app = express()
app.use(bodyParser.json())

///

app.use((req, res, next) => {
  res.setHeader('access-control-allow-origin', '*')
  next()
})

app.use('/history', history)
app.use('/message', message)

///

if(import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url)
  if (process.argv[1] === modulePath) {
    app.listen(8012)
  }
}

export default app
