import { camelCase, forEach, isArray, isFunction, replace, toArray } from 'lodash'
import { createStore } from 'redux'
import defaultReducer from './defaultReducer'
import noop from 'lib/noop'

const apps = {}

const addAttribute = function (item) {
  if (item.name === 'is') {
    return
  }
  this.attributes[item.name] = item.value
}


const dispatcher = (key, store) => value => {
  let newValue = value
  const state = store.getState()
  // if (isArray(state)) {
  //   state.push(value)
  //   newValue = state
  // }
  if (value && value.type) {
    return store.dispatch(value)
  }
  return store.dispatch({
    type: key,
    value: newValue
  })
}

const createBinding = function (el) {
  const key = el.dataset.bind
  const store = createStore(defaultReducer)
  store.subscribe(() => {
    const state = store.getState()
    el.innerHTML = state
  })
  this.bindings[key] = dispatcher(key, store)
  delete el.dataset.bind
}

const createData = function () {
  if (!this.data) {
    return
  }
  forEach(this.data, (value, key) => {
    if (value == null || isFunction(value)) {
      return
    }
    this[key] = value
    const store = createStore(this.update || defaultReducer)
    store.subscribe(() => {
      this[key] = store.getState()
    })
    this.data[key] = dispatcher(key, store)
    this.data[key](value)
    this.data[key].subscribe = store.subscribe
    this.onDataUpdated(key)
  })
}

const getElsForDataAttr = (element, selector) => [element].concat(toArray(element.querySelectorAll(`[${selector}]`)))

const composeInstance = function () {
  const proto = {
    attributes: {},
    bindings: {},
    onDataUpdated: noop,
    attachedCallback (element, attributes) {
      this.element = element

      attributes.forEach(item => {
        addAttribute.call(this, item)
      })

      const listeners = [
        'click',
        'keyup'
      ]

      const bindInlineListeners = (activeEl, data = {}, single = false) => {
        const removeListeners = []
        forEach(listeners, listener => {
          const attr = `on-${listener}`
          const dataAttr = `data-${attr}`
          const elements = single
            ? [activeEl]
            : getElsForDataAttr(activeEl, dataAttr)
          forEach(elements, el => {
            const key = camelCase(attr)
            const inlineFn = el.dataset[key]
            if (inlineFn == null) {
              return
            }
            const groups = inlineFn.split('(').join(' ').split(')').join('').split(' ')
            const fn = groups[0]
            const stringArgs = groups.slice(1)
            const handler = event => {
              const args = stringArgs.length
                ? stringArgs.map(string => {
                    if (string === '$event') {
                      return event
                    }
                    // if (string === 'index') {
                    //   return index
                    // }
                    return data
                  })
                : [event]
              this[fn].apply(this, args)
            }
            el.addEventListener(listener, handler)
            removeListeners.push(() => {
              el.removeEventListener(listener, handler)
            })
            delete el.dataset[key]
          })
        })
        return removeListeners
      }

      forEach(getElsForDataAttr(element, 'data-bind'), el => {
        if (!el.dataset.bind) {
          return
        }
        createBinding.call(this, el)
      })

      forEach(this.attributes, (value, key) => {
        this[key] = value
        if (this.bindings[key] == null) {
          return
        }
        this.bindings[key](value)
      })

      createData.call(this)

      forEach(getElsForDataAttr(element, 'data-bind-class'), el => {
        if (el.dataset.bindClass == null) {
          return
        }
        const separation = el.dataset.bindClass
          .replace(/ /g, '')
          .replace(/\r?\n|\r/g, '')
          .replace('{', '')
          .replace('}', '')
          .split(',')
        const groups = separation.map(s => s.split(':'))
        forEach(groups, group => {
          const className = group[0]
          const key = group[1]
          const toggle = () => {
            el.classList.toggle(className, this[key])
          }
          this.data[key].subscribe(toggle)
          toggle(className, this[key])
        })
        delete el.dataset.bindClass
      })

      forEach(getElsForDataAttr(element, `data-for`), el => {
        const key = 'for'
        if (el.dataset[key] == null) {
          return
        }
        const forValues = el.dataset[key].split(' ')
        const parentEl = el.parentElement
        const template = el.outerHTML
        const tempContainer = document.createDocumentFragment()
        let prevState = []
        let itemWrappers = []

        const update = (item, parentEl, newEl) => {
          let elTemplate = template
          let found = []
          let rxp = /{{([^}]+)}}/g
          let curMatch
          while (curMatch = rxp.exec(template)) {
            found.push(curMatch[1])
          }
          found = found.filter((string, index) => found.indexOf(string) === index)
          forEach(found, string => {
            const key = replace(string, ' ', '').split('.')[1]
            elTemplate = replace(elTemplate, `{{${string}}}`, item[key])
          })

          if (newEl == null) {
            let tempEl = document.createElement('div')
            tempEl.innerHTML = elTemplate
            newEl = tempEl.firstElementChild
            tempEl = null
            delete newEl.dataset[key]
            // console.log('NEW ELEMENT!', this)
            if (newEl.hasAttribute('is')) {
              const newInstance = compose(apps[newEl.getAttribute('is')], newEl)
              newEl = newInstance.element
              this.addChild(newInstance)
              update(item, parentEl, newEl)
              return
            }
          } else {
            // console.log('here')
          }
          const removeListeners = bindInlineListeners(newEl, item, false)
          // console.log(removeListeners)
          parentEl.appendChild(newEl)

          const itemWrapper = {
            item,
            el: newEl,
            remove() {
              itemWrappers.splice(itemWrappers.indexOf(this), 1)
              newEl.parentElement.removeChild(newEl)
              forEach(removeListeners, fn => {
                fn()
              })
            }
          }
          itemWrappers.push(itemWrapper)
        }

        const iterateItems = container => {
          const state = this[forValues[2]]
          const item = state[state.length - 1]
          if (state.length < prevState.length) {
            const removables = itemWrappers.filter(itemWrapper => !state.includes(itemWrapper.item))
            forEach(removables, itemWrapper => itemWrapper.remove())
            itemWrappers = itemWrappers.filter(itemWrapper => state.includes(itemWrapper.item))
          } else {
            const addable = state.filter(item => {
              const x = itemWrappers.filter(itemWrapper => itemWrapper.item === item).length
              return x === 0
            })
            forEach(addable, item => {
              update(item, container)
            })
          }
          prevState = state
        }

        iterateItems(tempContainer)

        parentEl.replaceChild(tempContainer, el)

        this.data[forValues[2]].subscribe(() => {
          iterateItems(parentEl)
        })
      })

      bindInlineListeners(element)

      this.attached()
    },
    createdCallback () {
      this.created()
    },
    attached: noop,
    created: noop
  }

  return Object.assign(proto, this)
}

const updateChildInstanceData = newData => childInstance => {
  forEach(newData, (value, key) => {
    childInstance.data[key] = value
  })
  createData.call(childInstance)
}

export const compose = (target, el) => {
  const instance = composeInstance.call(target)
  instance.onChildAdded = instance.onChildAdded || noop
  instance.children = []
  instance.addChild = function (childInstance) {
    this.children.push(childInstance)
    this.onChildAdded(childInstance)
  }
  instance.passData = function (newData, childInstance) {
    if (childInstance) {
      return updateChildInstanceData(newData)(childInstance)
    }
    forEach(this.children, updateChildInstanceData(newData))
  }
  instance.createdCallback()

  const tempEl = document.createElement('div')
  tempEl.innerHTML = instance.template

  const appEl = tempEl.firstElementChild
  if (appEl != null) {
    el.parentElement.replaceChild(appEl, el)
  }

  instance.attachedCallback(appEl || el, toArray(el.attributes))
  return instance
}

export const init = target => {
  if (apps[target.reference]) {
    return
  }
  apps[target.reference] = target
}
