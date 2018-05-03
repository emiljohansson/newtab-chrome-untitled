import { merge, isString } from 'lodash'

const styles = {}

const template = ``

const baseApp = {
  styles,
  template,
  data: {}
}

export default definition => {
  const vm = merge({}, baseApp, definition)
  if (isString(vm.template)) {
    const tempalteString = vm.template
    vm.template = () => tempalteString
  }
  return vm
}
