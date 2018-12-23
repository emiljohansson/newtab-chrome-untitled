import InstanceConstructor from '../../src/core/InstanceConstructor'
import instanceFactory, { InstanceOptions, Instance } from '../../src/core/Instance'
import { Component, decoratorOptions } from '../../src/core/decorators'

test('should create empty options object', () => {
  const options: InstanceOptions = decoratorOptions()
  expect(options.template).toBe(``)
  expect(options.styles).toEqual({})
  expect(options.data).toEqual({})
})

test('should allow undefined options', () => {
  @Component()
  class App extends InstanceConstructor {}
  const vm: Instance = instanceFactory(App, null)
  expect(vm.template).toBe(``)
  expect(vm.styles).toEqual({})
  expect(vm.data).toEqual({})
})

test('should create default options', () => {
  @Component({
    template: 123,
    styles: /a-z/
  })
  class App extends InstanceConstructor {}
  const vm: Instance = instanceFactory(App, null)
  expect(vm.template).toBe(``)
  expect(vm.styles).toEqual({})
  expect(vm.data).toEqual({})
})

test('should find template, styles, data in prototype', () => {
  @Component({
    template: `<div></div>`,
    styles: {
      display: 'block'
    },
    data: {
      value: 123
    }
  })
  class App extends InstanceConstructor {}
  const vm: Instance = instanceFactory(App, null)
  expect(vm.template).toBe(App.prototype.template)
  expect(vm.styles).toEqual(App.prototype.styles)
  expect(vm.data).toEqual(App.prototype.data)
})
