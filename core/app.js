import { forEach, kebabCase } from 'lodash'
import apps from 'core/apps'

// const objectToCss = obj => {
//   let result = ''
//   forEach(obj, (value, key) => {
//     result += `${kebabCase(key)}: ${value};\n`
//   })
//   return result
// }
//
// const initStyle = (App) => {
//   if (!App.styles) {
//     return
//   }
//   const styles = App.styles
//   const el = document.createElement('style')
//   let styleContent = ``
//   forEach(styles, (style, className) => {
//     styleContent += `
// .${className} {
//   ${objectToCss(style)}
// }
// `
//   })
//   el.innerHTML = styleContent
//   document.head.appendChild(el)
// }

export default (id, definition) => {
  // initStyle(definition)
  return apps(id, definition)
}
