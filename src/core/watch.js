import { forEach } from '../../node_modules/lodash-es/lodash.js'
import Subject from './Subject.js'

const subjects = {}

export const destroy = vm => {
  if (subjects[vm.$id]) {
    const destroySubject = subjects[vm.$id]['$destroy']
    if (destroySubject) {
      destroySubject.next()
    }
    forEach(subjects[vm.$id], (subject, key) => {
      subject.complete()
    })
  }
  delete subjects[vm.$id]
}

export default (vm, key) => {
  const id = typeof vm === 'string'
    ? vm
    : vm.$id
  const scope = subjects[id] = subjects[id] || {}
  scope[key] = scope[key] || Subject()
  return scope[key]
}
