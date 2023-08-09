import fs from 'fs'

import searchKnowledge from '../../search-knowledge.mjs'

const history = JSON.parse(fs.readFileSync('./fixture/history.json'))

const searchByContext = (query) =>
  Object
    .entries(history)
    .filter(([ chatid, record ]) => {
      for(const k in query)
        if(k in record.context
        && k !== 'chatid'
        && record.context[k] != query[k])
          return false
      return true
    }).map(([ chatid, record ]) =>
      ({ chatid, ...record })
    )

export default socket => function HistoryHandler(data) {
  const context = socket.context = data
  const records = searchByContext(context)

  const result = records.map(({ chatid, title, context, asked }) => ({
    chatid,
    title,
    context,
    history: asked.flatMap(question => [
      { side: 'ours', content: question },
      { side: 'theirs', content: searchKnowledge(question).response }
    ])
  }))

  result.map(entry => socket.emit('history', entry))
}
