import { forEach } from 'lodash'
import createSubject, { Subject } from './Subject'

const subjects: any = {}

export const destroy: any = (vm: any): void => {
  if (subjects[vm.$id]) {
    const destroySubject: Subject = subjects[vm.$id]['$destroy']
    if (destroySubject) {
      destroySubject.next()
    }
    forEach(subjects[vm.$id], (subject: Subject, key: string) => {
      subject.complete()
    })
  }
  delete subjects[vm.$id]
}

export default (vm: any, key: string): Subject => {
  const id: string = typeof vm === 'string'
    ? vm
    : vm.$id
  const scope: any = subjects[id] = subjects[id] || {}
  scope[key] = scope[key] || createSubject()
  return scope[key]
}
