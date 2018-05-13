import { isFunction } from '../../node_modules/lodash-es/lodash.js'

export default (vm, fn) => {
  if (isFunction(fn)) {
    fn.call(vm)
  }
}
