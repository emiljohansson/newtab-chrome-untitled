import { camelCase, filter, forEach } from 'lodash'
import subjectFactory, { Subject } from './Subject'
import { Instance } from './Instance'

const emitSelector = 'o-emit-'

export default (vm: Instance): void => {
  if (!vm.$el) {
    return
  }
  const attributes = filter(vm.$el.attributes, attribute => attribute.name.indexOf(emitSelector) > -1)
  if (!attributes.length) {
    return
  }
  forEach(attributes, attribute => {
    const name: string = camelCase(attribute.name.substr(emitSelector.length))
    const subject: Subject = subjectFactory()
    subject.subscribe((args: any) => {
      if (!vm.$parent) {
        return
      }
      const callback: any = vm.$parent[attribute.value]
      if (callback == null) {
        return
      }
      callback.apply(vm.$parent, args)
    })
    vm.$listeners[name] = subject
  })
}
