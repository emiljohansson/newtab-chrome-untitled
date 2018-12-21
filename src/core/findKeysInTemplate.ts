import { filter } from 'lodash'

const bracketsRegExp: RegExp = /{{([^}]+)}}/g

const first: any = (value: string, index: number, array: string[]) => array.indexOf(value) === index

export default (template: string): string[] => {
  const keys: string[] = []
  let currentMatch: RegExpExecArray | null
  // tslint:disable-next-line:no-conditional-assignment
  while ((currentMatch = bracketsRegExp.exec(template))) {
    keys.push(currentMatch[1].trim())
  }
  return filter(keys, first)
}
