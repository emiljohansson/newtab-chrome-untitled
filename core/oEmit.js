import { Subject } from 'rxjs/Subject'
import { camelCase, filter, forEach } from 'lodash'
import noop from 'lib/noop'

const emitSelector = 'o-emit-'

export default vm => {
  vm.$emit = noop
  if (vm.$el == null) {
    return
  }
  const attributes = filter(vm.$el.attributes, attribute => {
    return attribute.name.indexOf(emitSelector) > -1
  })
  if (!attributes.length) {
    return
  }
  vm.$listeners = {}
  forEach(attributes, attribute => {
    const name = camelCase(attribute.name.substr(emitSelector.length))
    const subject = new Subject()
    subject.subscribe((args) => {
      const callback = vm.$parent[attribute.value]
      if (callback == null) {
        return
      }
      callback.apply(vm.$parent, args)
    })
    vm.$listeners[name] = subject
  })
  vm.$emit = (type, ...args) => {
    const subject = vm.$listeners[type]
    if (subject == null) {
      return
    }
    subject.next(args)
  }
}
