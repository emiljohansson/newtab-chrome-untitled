import { filter } from 'lodash'

const bracketsRegExp = /{{([^}]+)}}/g

const first = (string, index, array) => array.indexOf(string) === index

export default template => {
  const keys = []
  let currentMatch
  while (currentMatch = bracketsRegExp.exec(template)) {
    keys.push(currentMatch[1].trim())
  }
  return filter(keys, first)
}
