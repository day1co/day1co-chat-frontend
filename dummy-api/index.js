import * as url from 'node:url'

import express from 'express'
import bodyParser from 'body-parser'

import history from './routes/history.js'
import messages from './routes/messages.js'

const app = express()
app.use(bodyParser.json())

///

app.use((req, res, next) => {
  res.setHeader('access-control-allow-origin', '*')
  next()
})

app.use('/history', history)
app.use('/messages', messages)

///

if(import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url)
  if (process.argv[1] === modulePath) {
    app.listen(8012)
  }
}

export default app
