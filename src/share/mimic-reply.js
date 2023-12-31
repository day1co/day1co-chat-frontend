const shiftInterval = (items, ontick, interval = 100) => {
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const item = items.shift()
      if(!item) {
        resolve()
        return clearTimeout(timer)
      }

      ontick(item)
    }, interval)
  })
}
const splitMessageOverTime = async (string, onmessage, interval = 100) => {
  const words = string
    .split(/(\s+)/)
    .reduce((p, c, i, l) =>
      i % 2? p
        : i? [...p, l[i - 1] + c]
          : [c],
    [])

  // const word = word?.replaceAll(/[\r\n\t\v]/g, ' ')
  await shiftInterval(words, word => onmessage(word), interval)
}

export default async (data, message, interval = 100) => {
  message.answer = []

  for(const block of data) {
    if(block.contents?.length === 0) {
      break
    }

    const result = {
      type: block.type,
      contents: null
    }
    message.answer.push(result)

    switch(block.type) {
      case 'links':
      case 'carousel':

        result.contents = []
        await shiftInterval(block.contents, chunk => result.contents.push(chunk), interval * 4)
        break
      case 'markdown':
      case 'text':
        result.contents = ''
        await splitMessageOverTime(block.contents, message => result.contents += message, interval)
        break
    }
  }
}
