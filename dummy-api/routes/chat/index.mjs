import HistoryHandler from './History.mjs'
import CreateHandler from './create.mjs'
import MessageHandler from './message.mjs'

export default io => {
  io.on('connection', socket => {
    socket.on('history', HistoryHandler(socket))
    socket.on('create', CreateHandler(socket))
    socket.on('message', MessageHandler(socket))
  })
}
