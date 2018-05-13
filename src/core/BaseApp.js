import { merge } from '../../node_modules/lodash-es/lodash.js'

const styles = {}

const template = ``

const baseApp = {
  styles,
  template,
  data: {}
}

export default definition => {
  const vm = merge({}, baseApp, definition)
  return vm
}
