export default socket => function CreateHandler(data) {
  const context = socket.context = data
  const chatid = socket.chatid = Date.now()

  console.log(`new client joined: got chatid ${chatid}, with context ${context}`)

  socket.emit('create', { chatid, context })
}
