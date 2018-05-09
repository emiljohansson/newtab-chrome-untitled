import { forEach, kebabCase, keys } from 'lodash'

const createClasses = (styles, rootClassName) => {
  const propKeys = keys(styles)
  const length = propKeys.length
  let classes = '\n'
  forEach(propKeys, (className, index) => {
    const scope = styles[className]
    const subScope = extractSubScope(scope, className)
    const value = createClassContent(scope)
    const dot = getDot(className, rootClassName)
    const lineBreak = index < length - 1
      ? '\n'
      : ''
    classes += `${dot}${className} {
${value}}${lineBreak}`
    classes += createClasses(subScope, className)
  })
  return classes
}

const extractSubScope = (scope, className) => {
  const propKeys = keys(scope)
  const subScope = {}
  forEach(propKeys, (key, index) => {
    if (key.indexOf('&') > -1) {
      subScope[key.replace(/&/g, `.${className}`)] = scope[key]
      delete scope[key]
    }
  })
  return subScope
}

const createClassContent = style => {
  const propKeys = keys(style)
  let result = ''
  forEach(propKeys, (key, index) => {
    const prop = kebabCase(key)
    if (key === 'extend') {
      result += createClassContent(style[key])
      return
    }
    const value = style[key]
    result += `${prop}: ${value};\n`
  })
  return result
}

const getDot = (className, rootClassName) => {
  if (className[0] === ':') {
    return ''
  }
  if (className.indexOf(`.${rootClassName}`) > -1) {
    return ''
  }
  return '.'
}

export default (styles = {}) => {
  const styleSheet = {
    isNew: true,
    attach (el) {
      const content = createClasses(styles)
      if (content.trim().length < 1) {
        return
      }
      const styleEl = document.createElement('style')
      styleEl.setAttribute('type', 'text/css')
      styleEl.innerHTML = content
      el.appendChild(styleEl)
    }
  }
  return styleSheet
}
