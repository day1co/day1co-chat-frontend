import fs from 'fs'

const knowledge = JSON.parse(fs.readFileSync('./fixture/knowledge.json'))

export default function searchKnowledge(question) {
  const tokens = question.split(' ')
  const matches = knowledge.map(_ => ({
    weight: tokens.reduce((p, c) => p + _.keywords.includes(c), 0),
    ..._
  }))
  return matches.reduce((p, c) => p.weight > c.weight? p : c)
}
