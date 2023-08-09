import searchKnowledge from '../../search-knowledge.mjs'

export default socket => function MessageHandler(data) {
  const question = data.question
  const chatid = data.chatid
  const msgid = socket.lastmsgid = Date.now()

  const match = searchKnowledge(question)
  // split words, and then group with heading whitespace(s)
  const words = match.response
    .split(/(\s+)/)
    .reduce((p, c, i, l) =>
      i % 2? p
        : i? [...p, l[i - 1] + c]
           : [c],
    [])
  let response = ''

  const timer = setInterval(() => {
    const word = words.shift()
    if(!word)
      return clearTimeout(timer)
    response += word + ' '
    socket.emit('chat', {
      chatid,
      msgid,
      response,
      incomplete: words.length > 0
    })
  }, 100)
}
