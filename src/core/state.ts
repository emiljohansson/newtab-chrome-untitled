import { assign, filter, forEach, keys, indexOf, isArray, isFunction } from 'lodash'
import { Subject } from './Subject'
import coreFunctions from './coreFunctions'
import callHook from './callHook'
import watch from './watch'
import { Instance } from './Instance'

const dataWatcher = {}

function ObserverArray (vm: any, key: string, array: any[], viewSubject: Subject<any>) {
  const subject: Subject<any> = new Subject()
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
  ], function (method: string) {
    array[method] = function (...args: any[]) {
      const data: any = {
        arg: args,
        method,
        inserted: []
      }
      switch (method) {
        case 'push':
        case 'unshift':
          data.inserted = args
          break
        case 'splice':
          data.inserted = args.slice(2)
          break
      }
      const result = Array.prototype[method].apply(this, args)
      subject.next(data)
      return result
    }
  })
}

const dataChanged = (vm: Instance, subject: Subject<any>, newValue: any) => {
  const cb = () => {
    subject.next(newValue)
  }
  dataWatcher[vm.$id] = dataWatcher[vm.$id] || []
  if (!dataWatcher[vm.$id].$functionInProgress) {
    cb()
    return
  }
  dataWatcher[vm.$id].push(cb)
}

const bind = (vm, fn) => {
  const orgFn = vm[fn]
  vm[fn] = function (...args: any[]) {
    dataWatcher[vm.$id] = dataWatcher[vm.$id] || []
    dataWatcher[vm.$id].$functionInProgress = true
    orgFn.apply(vm, args)
    let update
    // tslint:disable-next-line:no-conditional-assignment
    while ((update = dataWatcher[vm.$id].splice(0, 1)[0])) {
      update()
    }
    vm.$nextTick()
    delete dataWatcher[vm.$id].$functionInProgress
  }
}

const iterateData = vm => {
  const tickCallbacks: any[] = []
  vm.$nextTick = (cb: any) => {
    if (cb != null) {
      tickCallbacks.push(cb)
      return
    }
    if (tickCallbacks.length < 1) {
      return
    }
    let fn
    // tslint:disable-next-line:no-conditional-assignment
    while ((fn = tickCallbacks.splice(0, 1)[0])) {
      fn()
    }
  }
  const addWatch = (value, key) => {
    const subject: Subject<any> = new Subject()
    const viewSubject = watch(vm, key)
    if (isArray(value)) {
      ObserverArray(vm, key, value, viewSubject)
      vm[key] = value
      return
    }
    subject.subscribe((newValue: any) => {
      vm.$data[key] = newValue
      callHook(vm, vm.beforeUpdate)
      viewSubject.next(newValue)
      callHook(vm, vm.updated)
    })
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (newValue: any) {
        dataChanged(vm, subject, newValue)
      }
    })
    vm[key] = value
  }
  return addWatch
}

export default (vm: Instance) => {
  assign(vm.$data, vm.data)
  const publicMethods = filter(
    keys(vm),
    key => key[0] !== '$' && indexOf(coreFunctions, key) < 0 && isFunction(vm[key])
  )
  forEach(publicMethods, fn => {
    bind(vm, fn)
  })
  forEach(vm.$data, iterateData(vm))
}
