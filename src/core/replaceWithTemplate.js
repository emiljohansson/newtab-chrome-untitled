import { forEach, isFunction, reduce } from 'lodash'
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
  let styleSheet
  if (vm.useShadow) {
    // parentEl.appendChild(shadowContainer)
    shadowContainer.attachShadow({
      mode: 'open'
    })
    styleSheet = vm.styles
      ? StyleSheet(vm.styles)
      : vm.styleSheet
  }

  oEmit(vm)

  if (vm.template != null && vm.template !== '') {
    if (isFunction(vm.template)) {
      vm.$el = getElFromTemplate(vm.template(styleSheet.classes))
    } else {
      vm.$el = getElFromTemplate(vm.template)
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
      shadowContainer.shadowRoot.appendChild(vm.$el)
      parentEl.replaceChild(shadowContainer, oldEl)
      styleSheet.options.insertionPoint = vm.$el
      styleSheet.attach()
    } else {
      parentEl.replaceChild(vm.$el, oldEl)
    }
  }

  oOn(vm)
  oClass(vm)
}

const getElFromTemplate = template => {
  let tempEl = document.createElement('div')
  tempEl.innerHTML = template
  return tempEl.firstElementChild
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
