import { isFunction } from 'lodash'
import { Instance } from './Instance'

export default (vm: Instance, fn: any): void => {
  if (isFunction(fn)) {
    fn.call(vm)
  }
}
