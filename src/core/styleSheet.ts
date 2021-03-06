import { filter, forEach, kebabCase, keys } from 'lodash'

const createClasses = (styles, rootClassName: string = '') => {
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
    if (key === 'extend') {
      const extendSubScope = extractSubScope(scope[key], className)
      const selfKeys = getKeysWithSelfSelector(extendSubScope, className)
      forEach(selfKeys, selfKey => {
        subScope[selfKey] = extendSubScope[selfKey]
      })
      return
    }
    if (key.indexOf('&') > -1) {
      subScope[key.replace(/&/g, `.${className}`)] = scope[key]
      delete scope[key]
    }
  })
  return subScope
}

const getKeysWithSelfSelector = (scope, className) => filter(keys(scope), key => key.indexOf(className) > -1)

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

const getDot = (className, rootClassName: string) => {
  if (className[0] === ':') {
    return ''
  }
  if (className.indexOf(`.${rootClassName}`) > -1) {
    return ''
  }
  return '.'
}

export default (styles = {}, el: HTMLElement) => {
  const content = createClasses(styles)
  if (content.trim().length < 1) {
    return
  }
  const styleEl = document.createElement('style')
  styleEl.setAttribute('type', 'text/css')
  styleEl.innerHTML = content
  el.appendChild(styleEl)
}
