import { forEach, isArray } from 'lodash'
import { Subject } from 'rxjs/Subject'
import callHook from 'core/callHook'
import watch from 'core/watch'

function ObserverArray (vm, key, array, viewSubject) {
  const subject = new Subject()
  subject.subscribe(inserted => {
    callHook(vm, vm.beforeUpdate)
    viewSubject.next(inserted)
    callHook(vm, vm.updated)
  })
  forEach([
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ], function (method) {
    array[method] = function(...args) {
      const data = {
        arg: args,
        method,
        inserted: false
      }
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          data.inserted = true
          break
        case 'splice':
          console.log(args.slice(2))
          data.inserted = args.slice(2).length > 0
          break
      }
      const result = Array.prototype[method].apply(this, args)
      subject.next(data)
      return result
    }
  })
}

const iterateData = vm => {
  const addWatch = (value, key, list) => {
    const subject = new Subject(value)
    const viewSubject = watch(vm, key)
    if (isArray(value)) {
      ObserverArray(vm, key, value, viewSubject)
      vm[key] = value
      return
    }
    subject.subscribe(newValue => {
      vm.$data[key] = newValue
      callHook(vm, vm.beforeUpdate)
      viewSubject.next(newValue)
      callHook(vm, vm.updated)
    })
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (newValue) {
        subject.next(newValue)
      }
    })
    vm[key] = value
  }
  return addWatch
}

export default (vm) => {
  vm.$data = vm.data
  forEach(vm.$data, iterateData(vm))
}
