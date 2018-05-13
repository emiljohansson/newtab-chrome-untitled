import { isFunction } from 'lodash-es'

export default (vm, fn) => {
  if (isFunction(fn)) {
    fn.call(vm)
  }
}
