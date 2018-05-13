import { merge } from 'lodash-es'

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
