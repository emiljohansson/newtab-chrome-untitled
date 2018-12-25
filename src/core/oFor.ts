import { filter, forEach, isElement, map, toString, uniqueId } from 'lodash'
import attachStyleSheet from './styleSheet'
import apps from './apps'
import instanceFactory, { Instance } from './Instance'
import watch from './watch'
import HistoryNodes from './HistoryNodes'
import findKeysInTemplate from './findKeysInTemplate'
import getAllTextNodes from './getAllTextNodes'
import replaceBracketContent from './replaceBracketContent'
import { Subject } from './Subject'
import { initDirective, getDirective } from './directives'

export const forSelector = 'o-for'

function CacheArray (vm: Instance, ref: string | null): any[] {
  const array: any[] = []

  if (!ref) {
    return array
  }
  vm.$refs[ref] = []

  forEach([
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ], function (method: string) {
    array[method] = function (...args: any[]) {
      const result = Array.prototype[method].apply(this, args)
      vm.$refs[ref] = map(array, obj => obj.vm)
      return result
    }
  })

  return array
}

export default function (this: Instance, el: HTMLElement, binding: any, context: any = {}) {
  const vm: Instance = this
  const parentEl: HTMLElement = el.parentElement || (el.parentNode as any).host
  const id: string = uniqueId('oFor_')
  const template: string = el.outerHTML
  const keys: string[] = findKeysInTemplate(template)
  const tempContainer: DocumentFragment = document.createDocumentFragment()
  const ref: string | null = el.getAttribute('o-ref')
  const forValues: string[] = binding.expression.split(' ')
  const valueString: string = forValues[0]
  const dataKey: string = forValues[2]
  const dataItems: any[] = ({
    ...vm.data,
    ...context
  })[dataKey]
  const currentContextKeys: string[] = [
    ...Object.keys(vm.data),
    valueString
  ]

  const cache: any[] = CacheArray(vm, ref)

  const viewSubject = watch(vm, dataKey)
  viewSubject.subscribe(data => {
    let index: number
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
    const removedItems: any[] = []
    index = cache.length
    while (index--) {
      const item: any = cache[index]
      if (vm.data[dataKey].indexOf(item.data) < 0) {
        removedItems.push(item)
        cache.splice(index, 1)
      }
    }
    forEach(removedItems, item => {
      vm.$children.remove(item.vm)
    })
  })

  const insertNode: any = (dataItem: any, index: number, container: any, method: string = 'push'): void => {
    container = container != null && (isElement(container) || container.toString() === '[object ShadowRoot]' || container.toString() === '[object DocumentFragment]')
      ? container
      : tempContainer
    const cloneNode: HTMLElement = el.cloneNode(true) as HTMLElement
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
    const childContext: any = {}
    childContext[valueString] = dataItem
    const textNodes: any = getAllTextNodes(cloneNode)
    let tempValue: any = dataItem
    const subjects: Subject<any>[] = []

    if (vm.data[dataKey]) {
      Object.defineProperty(vm.data[dataKey], index.toString(), {
        get () {
          return tempValue
        },
        set (newValue: any) {
          subjects[index].next(newValue)
        }
      })
    }

    forEach(
      filter(keys, (key: string): boolean => {
        return currentContextKeys.indexOf(key) > -1
          || currentContextKeys.filter(
            (contextKey: string) => key.indexOf(`${contextKey}.`) > -1
          ).length > 0
      }),
      (key: string): void => {
        const historyNodes = HistoryNodes(key, textNodes)
        const update: any = (newValue: any): void => {
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
        const subject: Subject<any> = watch(id, index)
        subject.subscribe(update)
        subjects[index] = subject

        update(dataItem)
      }
    )

    cloneNode.removeAttribute(forSelector)
    container.appendChild(cloneNode)

    if (findForLoopEl(cloneNode.children, childContext)) {
      // console.log('TODO fix observer')
    }
  }

  const findForLoopEl: any = (children: HTMLElement[], context: any): boolean => {
    let found: boolean = false
    const handleEl: (el: HTMLElement) => void = initDirective(vm, forSelector, getDirective(forSelector), context)
    forEach(children, (el: HTMLElement) => {
      if (el.hasAttribute(forSelector)) {
        found = true
        handleEl(el)
      }
    })
    return found
  }

  const App = (el: HTMLElement, parent, context, appendFirst) => {
    const definition: any = apps(toString(el.getAttribute('is')))
    const newVm: Instance = instanceFactory(definition, el, context)
    vm.$children.push(newVm)
    if (appendFirst && parent.children.length > 0) {
      parent.insertBefore(newVm.$host, parent.firstChild)
    } else {
      const length = cache.length
      if (length > 0 && parent.childNodes.length > 0) {
        parent.insertBefore(newVm.$host, cache[length - 1].vm.$host.nextSibling)
      } else {
        parent.appendChild(newVm.$host)
      }
    }
    attachStyleSheet(newVm.styles, newVm.$el as HTMLElement)
    return newVm
  }

  forEach(dataItems, insertNode)

  if (parentEl.shadowRoot !== null) {
    parentEl.shadowRoot.replaceChild(tempContainer, el)
  } else {
    parentEl.replaceChild(tempContainer, el)
  }
}
