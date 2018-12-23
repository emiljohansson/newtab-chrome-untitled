import { camelCase, filter, forEach } from 'lodash'
import { Subject } from './Subject'
import { Instance } from './Instance'

const emitSelector = 'o-emit-'

export default (vm: Instance): void => {
  if (!vm.$el) {
    return
  }
  const attributes: Attr[] = filter(vm.$el.attributes, (attribute: Attr) => attribute.name.indexOf(emitSelector) > -1)
  if (!attributes.length) {
    return
  }
  forEach(attributes, (attribute: Attr) => {
    const name: string = camelCase(attribute.name.substr(emitSelector.length))
    const subject: Subject<any> = new Subject()
    subject.subscribe((args: any) => {
      if (!vm.$parent) {
        return
      }
      const callback: any = vm.$parent[attribute.value]
      if (!callback) {
        return
      }
      callback.apply(vm.$parent, args)
    })
    vm.$listeners[name] = subject
  })
}
