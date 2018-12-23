import { isFunction, isPlainObject, isString, keys, merge } from 'lodash'
import InstanceConstructor from './InstanceConstructor'
import { decoratorOptions } from './decorators'

export default (definition: any): any => {
  let instance: any
  if (isFunction(definition)) {
    instance = new (definition as any)()
  } else {
    const vm: InstanceConstructor = new InstanceConstructor()
    instance = merge(vm, definition)
  }
  if (definition.prototype) {
    keys(decoratorOptions(definition.prototype)).forEach((key: string) => {
      const value: any = definition.prototype[key]
      if (value) {
        if (isString(value)) {
          instance[key] = value
        } else if (isPlainObject(value)) {
          instance[key] = { ...value }
        }
      }
    })
  }
  return instance
}
