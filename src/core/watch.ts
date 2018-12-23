import { forEach } from 'lodash'
import { Subject } from './Subject'

const subjects: any = {}

export const destroy: any = (vm: any): void => {
  if (subjects[vm.$id]) {
    const destroySubject: Subject<void> = subjects[vm.$id]['$destroy']
    if (destroySubject) {
      destroySubject.next()
    }
    forEach(subjects[vm.$id], (subject: Subject<void>, key: string) => {
      subject.complete()
    })
  }
  delete subjects[vm.$id]
}

export default (vm: any, key: string): Subject<void> => {
  const id: string = typeof vm === 'string'
    ? vm
    : vm.$id
  const scope: any = subjects[id] = subjects[id] || {}
  scope[key] = scope[key] || new Subject()
  return scope[key]
}
