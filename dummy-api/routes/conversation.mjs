import fs from 'fs'

const knowledge = JSON.parse(fs.readFileSync('./fixture/knowledge.json'))

export default io => {
  io.on('connection', socket => {

    socket.on('create', data => {
      const context = socket.context = data
      const convid = socket.convid = Date.now()

      console.log(`new client joined: got convid ${convid}, with context ${context}`)

      socket.emit('create', { convid, context })
    })

    socket.on('chat', data => {
      const question = data.question
      const msgid = socket.lastmsgid = Date.now()

      const tokens = question.split(' ')
      const matches = knowledge.map(_ => ({
        weight: tokens.reduce((p, c) => p + _.keywords.includes(c), 0),
        ..._
      }))
      const match = matches.reduce((p, c) => p.weight > c.weight? p : c)

      const words = match.response.split(' ')
      let response = ''

      const timer = setInterval(() => {
        const word = words.shift()
        if(!word)
          return clearTimeout(timer)
        response += word + ' '
        socket.emit('chat', {
          msgid,
          response,
          incomplete: words.length > 0
        })
      }, 100)
    })
  })
}
