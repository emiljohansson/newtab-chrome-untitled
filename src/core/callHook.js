import { isFunction } from 'lodash'

export default (vm, fn) => {
  if (isFunction(fn)) {
    fn.call(vm)
  }
}
