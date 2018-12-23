import * as sinon from 'sinon'
import { Instance } from '../../src/core/Instance'
import InstanceConstructor from '../../src/core/InstanceConstructor'

const defaultInstance: any = (options: any = {}): Instance => {
  const vm: InstanceConstructor = new InstanceConstructor()
  Object.keys(options).forEach((key: string) => {
    vm[key] = options[key]
  })
  return vm
}

test('should call methods in order', () => {
  const beforeDestroy = sinon.spy()
  const destroyed = sinon.spy()

  const vm: Instance = defaultInstance({
    beforeDestroy,
    destroyed
  })
  const order: any[] = [
    beforeDestroy,
    destroyed
  ]
  vm.$destroy()
  sinon.assert.callOrder.apply(null, order)
})

test('should remove element', () => {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const vm: Instance = defaultInstance({
    $host: el
  })
  vm.$destroy()
  expect(document.body.children.length).toBe(0)
})
