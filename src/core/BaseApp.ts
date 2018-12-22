import { isFunction, merge } from 'lodash'
import InstanceConstructor from './InstanceConstructor'

export default (definition: any): any => {
  if (isFunction(definition)) {
    return new (definition as any)()
  }
  const vm: InstanceConstructor = new InstanceConstructor()
  return merge(vm, definition)
}
