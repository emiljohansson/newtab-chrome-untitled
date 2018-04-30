import { forEach, isFunction, reduce, slice } from 'lodash'
import StyleSheet from 'stylesheet'
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

const replaceWithTemplate = vm => {
  if (vm.$el == null || vm.template == null) {
    return
  }
  const oldEl = vm.$el
  const parentEl = oldEl.parentElement || oldEl.parentNode
  const shadowContainer = document.createElement('div')
  let dependencyElements
  let styleSheet
  shadowContainer.attachShadow({
    mode: 'open'
  })
  styleSheet = StyleSheet(vm.styles)
  const template = vm.template(styleSheet.classes)

  oEmit(vm)
  vm.$el = shadowContainer

  if (vm.template != null && vm.template !== '') {
    if (isFunction(vm.template)) {
      const elements = getElFromTemplate(template)
      if (vm.data.class) {
        vm.$el.className = vm.data.class
      }
      vm.$el.innerHTML = oldEl.innerHTML
      vm.$el.shadowRoot.appendChild(elements[0].content.cloneNode(true))
      dependencyElements = slice(elements, 1)
      forEach(dependencyElements, el => {
        shadowContainer.shadowRoot.appendChild(el)
      })
    } else {
      console.log('wrong implementation!')
    }
  }
  const forElements = getElsByAttr(vm.$el.shadowRoot || vm.$el, forSelector)
  forEach(forElements, element => {
    oFor(vm, element)
  })

  const preTextNodes = getAllTextNodes(vm.$el)
  forEach(preTextNodes, node => {
    oContent(vm, vm.$tempContent)
  })
  delete vm.$tempContent

  const textNodes = getAllTextNodes(vm.$el)
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
    parentEl.replaceChild(vm.$el, oldEl)
    styleSheet.options.insertionPoint = vm.$el.shadowRoot.lastElementChild
    styleSheet.attach()
    vm.styleSheet = styleSheet
  }

  oOn(vm)
  oClass(vm)
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
