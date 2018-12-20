import { merge } from 'lodash'

const styles: any = {}

const template: any = ``

const baseApp: any = {
  styles,
  template,
  data: {}
}

export default (definition: any): any => {
  const vm: any = merge({}, baseApp, definition)
  return vm
}
