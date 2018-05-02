import test from 'ava'
import Instance from 'core/Instance'
import oFor from 'core/oFor'

test('should create an element for each item in the list', t => {
  const el = document.createElement('div')
  el.innerHTML = `<div o-for="value in list">{{value}}</div>`
  const array = ['foo', 'bar']
  const App = {
    data: {
      list: array
    }
  }
  const vm = Instance(App, el)
  oFor(vm, el.firstChild)
  t.is(el.children.length, 2)
  const firstChild = el.children[0]
  const secondChild = el.children[1]
  t.is(firstChild.innerHTML, array[0])
  t.is(secondChild.innerHTML, array[1])
})

test('should update view when item in list changes', t => {
  const el = document.createElement('div')
  el.innerHTML = `<div o-for="value in list">{{value}}</div>`
  const array = ['foo', 'bar']
  const App = {
    data: {
      list: array
    }
  }
  const vm = Instance(App, el)
  oFor(vm, el.firstChild)
  t.is(el.children.length, 2)
  vm.data.list[0] = 'Hello'
  vm.data.list[1] = 'World'
  const firstChild = el.children[0]
  const secondChild = el.children[1]
  t.is(firstChild.innerHTML, 'Hello')
  t.is(secondChild.innerHTML, 'World')
})
