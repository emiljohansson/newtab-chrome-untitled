import { filter } from 'lodash'

const bracketsRegExp = /{{([^}]+)}}/g

const first: any = (value: string, index, array) => array.indexOf(value) === index

export default (template: string): string[] => {
  const keys: string[] = []
  let currentMatch: RegExpExecArray | null
  // tslint:disable-next-line:no-conditional-assignment
  while ((currentMatch = bracketsRegExp.exec(template))) {
    keys.push(currentMatch[1].trim())
  }
  return filter(keys, first)
}
