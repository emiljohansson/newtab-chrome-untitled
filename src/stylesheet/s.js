import { forEach, kebabCase, keys } from 'lodash'

const createClasses = styles => {
  const propKeys = keys(styles)
  const length = propKeys.length
  let classes = ''
  forEach(propKeys, (key, index) => {
    const value = createClassContent(styles[key])
    const dot = key[0] === ':'
      ? ''
      : '.'
    const lineBreak = index < length - 1
      ? '\n'
      : ''
    classes += `${dot}${key} {
${value}}${lineBreak}`
  })
  return classes
}

const createClassContent = style => {
  const propKeys = keys(style)
  let result = ''
  forEach(propKeys, (key, index) => {
    const prop = kebabCase(key)
    const value = style[key]
    result += `${prop}: ${value};\n`
  })
  return result
}

export default (styles = {}) => {
  const styleSheet = {
    isNew: true,
    attach (el) {
      const styleEl = document.createElement('style')
      styleEl.setAttribute('type', 'text/css')
      styleEl.innerHTML = createClasses(styles)
      el.appendChild(styleEl)
    }
  }
  return styleSheet
}
