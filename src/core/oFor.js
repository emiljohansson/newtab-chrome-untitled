import { forEach, isElement, map, uniqueId } from 'lodash'
import attachStyleSheet from 'core/styleSheet'
import apps from 'core/apps'
import Instance from 'core/Instance'
import watch from 'core/watch'
import HistoryNodes from 'core/HistoryNodes'
import findKeysInTemplate from 'core/findKeysInTemplate'
import getAllTextNodes from 'core/getAllTextNodes'
import replaceBracketContent from 'core/replaceBracketContent'

export const forSelector = 'o-for'

function CacheArray (vm, ref) {
  const array = []

  if (ref != null) {
    vm.$refs[ref] = []
  }

  forEach([
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ], function (method) {
    array[method] = function (...args) {
      const result = Array.prototype[method].apply(this, args)
      if (vm.$refs[ref] != null) {
        vm.$refs[ref] = map(array, obj => obj.vm)
      }
      return result
    }
  })

  return array
}

export default function (el, binding) {
  const vm = this
  const parentEl = el.parentElement || el.parentNode.host
  const id = uniqueId('oFor_')
  const template = el.outerHTML
  const keys = findKeysInTemplate(template)
  const tempContainer = document.createDocumentFragment()
  const ref = el.getAttribute('o-ref')
  const forValues = binding.expression.split(' ')
  const valueString = forValues[0]
  const dataKey = forValues[2]
  const dataItems = vm.data[dataKey]

  const cache = CacheArray(vm, ref)

  const viewSubject = watch(vm, dataKey)
  viewSubject.subscribe(data => {
    let index
    if (data.inserted.length > 0) {
      index = 0
      if (data.method === 'splice') {
        // TODO move around elements
        // TODO remove elements
        // data is not correct here
        return
      } else if (data.method === 'push') {
        index = vm.data[dataKey].length - 1
      }
      insertNode(vm.data[dataKey][index], index, parentEl.shadowRoot || parentEl, data.method)
      return
    }
    const removedItems = []
    index = cache.length
    while (index--) {
      const item = cache[index]
      if (vm.data[dataKey].indexOf(item.data) < 0) {
        removedItems.push(item)
        cache.splice(index, 1)
      }
    }
    forEach(removedItems, item => {
      vm.$children.remove(item.vm)
    })
  })

  const insertNode = (dataItem, index, container, method = 'push') => {
    container = container != null && (isElement(container) || container.toString() === '[object ShadowRoot]' || container.toString() === '[object DocumentFragment]')
      ? container
      : tempContainer
    const cloneNode = el.cloneNode(true)
    if (cloneNode.hasAttribute('is')) {
      const newVm = App(cloneNode, container, dataItem, index === 0)
      // const method = index === 0
      //   ? 'unshift'
      //   : 'push'
      cache[method]({
        vm: newVm,
        data: dataItem
      })
      return
    }
    const textNodes = getAllTextNodes(cloneNode)
    let tempValue = dataItem
    const subjects = []

    Object.defineProperty(vm.data[dataKey], index.toString(), {
      get () {
        return tempValue
      },
      set (newValue) {
        subjects[index].next(newValue)
      }
    })

    forEach(keys, key => {
      const historyNodes = HistoryNodes(key, textNodes)
      const update = newValue => {
        tempValue = newValue
        forEach(historyNodes, historyNode => {
          historyNode.node.textContent = replaceBracketContent(
            historyNode.orgContent,
            newValue,
            key,
            valueString
          )
        })
      }
      const subject = watch(id, index)
      subject.subscribe(update)
      subjects[index] = subject

      update(dataItem)
    })

    cloneNode.removeAttribute(forSelector)
    container.appendChild(cloneNode)
  }

  const App = (el, parent, context, appendFirst) => {
    const definition = apps(el.getAttribute('is'))
    const newVm = Instance(definition, el, context)
    vm.$children.push(newVm)
    if (appendFirst && parent.children.length > 0) {
      parent.insertBefore(newVm.$el, parent.firstChild)
    } else {
      const length = cache.length
      if (length > 0 && parent.childNodes.length > 0) {
        parent.insertBefore(newVm.$el, cache[length - 1].vm.$el.nextSibling)
      } else {
        parent.appendChild(newVm.$el)
      }
    }
    attachStyleSheet(newVm.styles, newVm.$el.shadowRoot)
    return newVm
  }

  forEach(dataItems, insertNode)

  if (parentEl.shadowRoot != null) {
    parentEl.shadowRoot.replaceChild(tempContainer, el)
  } else {
    parentEl.replaceChild(tempContainer, el)
  }
}
