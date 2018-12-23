import { isFunction, merge } from 'lodash'
import InstanceConstructor from './InstanceConstructor'

export default (definition: any): any => {
  let instance: any
  if (isFunction(definition)) {
    instance = new (definition as any)()
  } else {
    const vm: InstanceConstructor = new InstanceConstructor()
    instance = merge(vm, definition)
  }
  if (!instance.template && definition.prototype && definition.prototype.template) {
    instance.template = definition.prototype.template
  }
  return instance
}
