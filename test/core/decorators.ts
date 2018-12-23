import InstanceConstructor from '../../src/core/InstanceConstructor'
import instanceFactory from '../../src/core/Instance'
import { Component } from '../../src/core/decorators'

test('should find template in prototype', () => {
  @Component({
    template: `<div></div>`
  })
  class App extends InstanceConstructor {}
  const vm: any = instanceFactory(App, null)
  expect(vm.template).toBe(App.prototype.template)
})
