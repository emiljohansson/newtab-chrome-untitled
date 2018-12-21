import * as sinon from 'sinon'
import { noop } from 'lodash'
import instanceMixin from '../../src/core/Instance'
import directive from '../../src/core/directive'
import { remove } from '../../src/core/directives'

test('should do nothing', () => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.innerHTML = `<span bar>Bar</span>`
  document.body.appendChild(el)
  directive('foo', callback)
  directive('bar', {})
  const vm = instanceMixin({}, el)
  expect(callback.called).toBeFalsy()
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should call when found', () => {
  expect.assertions(1)
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', el => {
    expect(el.innerHTML).toBe('Foo')
  })
  vm = instanceMixin({}, el)
  vm.$destroy()
  remove('foo-bar')
})

test('should throw error when already defined', () => {
  directive('foo-bar', noop)
  expect(() => {
    directive('foo-bar', noop)
  }).toThrowError('foo-bar directive is already defined')
  remove('foo-bar')
})

test('should call each element found', () => {
  expect.assertions(3)
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span><span foo-bar>Bar</span>`
  document.body.appendChild(el)
  let index = 0
  directive('foo-bar', el => {
    expect(el.innerHTML).toBe(index === 0 ? 'Foo' : 'Bar')
    index++
  })
  vm = instanceMixin({}, el)
  expect(index).toBe(2)
  vm.$destroy()
  remove('foo-bar')
})

test('should call all directives', () => {
  const fooCallback = sinon.spy()
  const barCallback = sinon.spy()
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo>Foo</span><span bar>Bar</span>`
  document.body.appendChild(el)
  directive('foo', fooCallback)
  directive('bar', barCallback)
  vm = instanceMixin({}, el)
  expect(fooCallback.called).toBeTruthy()
  expect(barCallback.called).toBeTruthy()
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should not share bindings', () => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo>Foo</span><span foo>Bar</span>`
  document.body.appendChild(el)
  const bindings: any[] = []
  directive('foo', (el: HTMLElement, binding: any) => {
    binding.id = 'foo' + bindings.length
    bindings.push(binding)
  })
  vm = instanceMixin({}, el)
  expect(bindings[0].id).toBe('foo0')
  expect(bindings[1].id).toBe('foo1')
  vm.$destroy()
  remove('foo')
  remove('bar')
})

test('should link this to vm', () => {
  let vm
  let context
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', function (this: any, el, binding) {
    context = this
  })
  vm = instanceMixin({
    data: {
      message: 'hello!'
    }
  }, el)
  expect(context.message).toBe(vm.message)
  vm.$destroy()
  remove('foo-bar')
})

test('should bind binding.value to a data variable', () => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="message">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', {
    bind (el: HTMLElement, binding: any) {
      expect(binding.value).toBe(expected)
      expect(binding.expression).toBe('message')
      count++
      oldValue = binding.value
    },
    update (el: HTMLElement, binding: any) {
      expect(binding.value).toBe(expected)
      expect(binding.expression).toBe('message')
      expect(binding.oldValue).toBe(oldValue)
      count++
    }
  })
  vm = instanceMixin({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  expect(count).toBe(2)
  vm.$destroy()
  remove('foo-bar')
})

test('should convert object literal value to binding.value', () => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ border-color: 'white', text: 'hello!' }">Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', (el: HTMLElement, binding: any) => {
    expect(binding.value['border-color']).toBe('white')
    expect(binding.value.text).toBe('hello!')
    expect(binding.expression).toBe(`{ border-color: 'white', text: 'hello!' }`)
  })
  vm = instanceMixin({}, el)
  vm.$destroy()
  remove('foo-bar')
})

test('should call same function for both bind and update', () => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ text: message }">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', function (el: HTMLElement, binding: any) {
    expect(binding.name).toBe('foo-bar')
    expect(binding.value.text).toBe(expected)
    expect(binding.oldValue).toBe(oldValue)
    oldValue = binding.value
    count++
  })
  vm = instanceMixin({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  expect(count).toBe(2)
  vm.$destroy()
  remove('foo-bar')
})

test('should watch object literal values', () => {
  let vm
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar="{ text: message }">Foo</span>`
  document.body.appendChild(el)
  let expected = 'hello 1'
  let count = 0
  let oldValue
  directive('foo-bar', {
    bind (el: HTMLElement, binding: any) {
      expect(binding.value.text).toBe(expected)
      oldValue = binding.value
    },
    update (el: HTMLElement, binding: any) {
      expect(binding.value.text).toBe(expected)
      expect(binding.oldValue).toBe(oldValue)
      count++
    }
  })
  vm = instanceMixin({
    data: {
      message: 'hello 1'
    }
  }, el)
  expected = 'hello 2'
  vm.message = expected
  expect(count).toBe(1)
  vm.$destroy()
  remove('foo-bar')
})

test('should call unbind on destroy', () => {
  const callback = sinon.spy()
  const el = document.createElement('div')
  el.innerHTML = `<span foo-bar>Foo</span>`
  document.body.appendChild(el)
  directive('foo-bar', {
    unbind: callback
  })
  const vm = instanceMixin({}, el)
  vm.$destroy()
  expect(callback.called).toBeTruthy()
  remove('foo-bar')
})
