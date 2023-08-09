export default (string, onmessage, interval = 100) => {
  return new Promise((resolve, reject) => {
    const words = string
      .split(/(\s+)/)
      .reduce((p, c, i, l) =>
        i % 2? p
          : i? [...p, l[i - 1] + c]
            : [c],
      [])

    const timer = setInterval(() => {
      const word = words.shift()?.replaceAll(/[\r\n\t\v]/g, ' ')
      if(!word) {
        resolve()
        return clearTimeout(timer)
      }
      onmessage(word)
    }, interval)
  })
}
