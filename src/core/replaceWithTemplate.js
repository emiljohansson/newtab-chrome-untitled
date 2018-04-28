import { forEach, isFunction, reduce, slice } from 'lodash'
import { create } from 'jss'
import preset from 'jss-preset-default'
import watch from 'core/watch'
import HistoryNodes from 'core/HistoryNodes'
import oClass from 'core/oClass'
import oEmit from 'core/oEmit'
import oContent from 'core/oContent'
import oFor, { forSelector } from 'core/oFor'
import oOn from 'core/oOn'
import findKeysInTemplate from 'core/findKeysInTemplate'
import getAllTextNodes from 'lib/getAllTextNodes'
import replaceBracketContent from 'lib/replaceBracketContent'
import getElsByAttr from 'lib/getElsByAttr'

const StyleSheet = styles => {
  const jss = create()
  jss.setup(preset())
  return jss.createStyleSheet(styles)
}

const replaceWithTemplate = vm => {
  if (vm.$el == null || vm.template == null) {
    return
  }
  const oldEl = vm.$el
  const parentEl = oldEl.parentElement
  const shadowContainer = document.createElement('div')
  let dependencyElements
  let styleSheet
  if (vm.useShadow) {
    shadowContainer.attachShadow({
      mode: 'open'
    })
    shadowContainer.className = oldEl.className
    styleSheet = vm.styles
      ? StyleSheet(vm.styles)
      : vm.styleSheet
  }

  oEmit(vm)

  if (vm.template != null && vm.template !== '') {
    if (isFunction(vm.template)) {
      if (vm.useShadow) {
        const elements = getElFromTemplate(vm.template(styleSheet.classes)) // , oldEl.innerHTML)
        if (elements[0].tagName === 'TEMPLATE') {
          vm.$el = shadowContainer
          vm.$el.className = oldEl.className
          vm.$el.innerHTML = oldEl.innerHTML
          vm.$el.shadowRoot.appendChild(elements[0].content.cloneNode(true))
          dependencyElements = slice(elements, 1)
          forEach(dependencyElements, el => {
            shadowContainer.shadowRoot.appendChild(el)
          })
        } else {
          vm.$el = elements[0]
        }
      }
    } else {
      vm.$el = getElFromTemplate(vm.template)[0]
    }
  }
  const forElements = getElsByAttr(vm.$el, forSelector)
  forEach(forElements, element => {
    oFor(vm, element)
  })

  const preTextNodes = getAllTextNodes(vm.$el)
  forEach(preTextNodes, node => {
    oContent(vm, vm.$tempContent)
  })
  delete vm.$tempContent

  const textNodes = getAllTextNodes(vm.$el)
  const keys = findKeysInTemplate(vm.template)

  forEach(keys, key => {
    const historyNodes = HistoryNodes(key, textNodes)
    const update = updateWithNewValue(vm, historyNodes)
    const subject = watch(vm, key)
    subject.subscribe(update)
    if (vm.data[key] != null) {
      update(vm.data[key])
    }
  })

  if (parentEl != null) {
    if (vm.useShadow) {
      // shadowContainer.shadowRoot.appendChild(vm.$el)
      // forEach(dependencyElements, el => {
      //   shadowContainer.shadowRoot.appendChild(el)
      // })
      parentEl.replaceChild(shadowContainer, oldEl)
      // if (vm.debug) {
      //   debugger
      // }
      styleSheet.options.insertionPoint = vm.$el.shadowRoot.lastElementChild
      styleSheet.attach()
      vm.styleSheet = styleSheet
    } else {
      parentEl.replaceChild(vm.$el, oldEl)
    }
  } else if (shadowContainer.shadowRoot != null) {
    shadowContainer.shadowRoot.appendChild(vm.$el)
    forEach(dependencyElements, el => {
      shadowContainer.shadowRoot.appendChild(el)
    })
    // parentEl.replaceChild(shadowContainer, oldEl)
    styleSheet.options.insertionPoint = vm.$el
    styleSheet.attach()
    vm.styleSheet = styleSheet
    vm.$shadowContainer = shadowContainer
  }

  oOn(vm)
  oClass(vm)
}

const getElFromTemplate = template => {
  let tempEl = document.createElement('div')
  tempEl.innerHTML = template // .replace('<slot></slot>', content)
  return tempEl.children
}

const updateWithNewValue = (vm, historyNodes) => newValue => {
  forEach(historyNodes, historyNode => {
    historyNode.node.textContent = reduce(
      vm.$data,
      replaceBracketContent,
      historyNode.orgContent
    )
  })
}

export default replaceWithTemplate
