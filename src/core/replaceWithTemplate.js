import { forEach, reduce } from '../../node_modules/lodash-es/lodash.js'
import attachStyleSheet from './styleSheet.js'
import watch from './watch.js'
import HistoryNodes from './HistoryNodes.js'
import findKeysInTemplate from './findKeysInTemplate.js'
import getAllTextNodes from './getAllTextNodes.js'
import replaceBracketContent from './replaceBracketContent.js'

const replaceWithTemplate = vm => {
  if (vm.$el == null || vm.template == null) {
    return
  }
  const oldEl = vm.$el
  const parentEl = oldEl.parentElement || oldEl.parentNode
  const shadowContainer = document.createElement('div')
  shadowContainer.attachShadow({
    mode: 'open'
  })
  const template = vm.template

  vm.$host = shadowContainer
  vm.$el = shadowContainer.shadowRoot

  const elements = getElFromTemplate(template)
  if (vm.data.class) {
    vm.$host.className = vm.data.class
  }
  vm.$host.innerHTML = oldEl.innerHTML
  vm.$el.appendChild(elements[0].content.cloneNode(true))

  const textNodes = getAllTextNodes(vm.$host)
  const keys = findKeysInTemplate(template)

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
    parentEl.replaceChild(vm.$host, oldEl)
    attachStyleSheet(vm.styles, vm.$el)
  }
}

const getElFromTemplate = template => {
  if (template.indexOf('<template') < 0) {
    template = `<template>${template}</template>`
  }
  let tempEl = document.createElement('div')
  tempEl.innerHTML = template
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
