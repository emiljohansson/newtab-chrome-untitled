import InstanceConstructor from '../../src/core/InstanceConstructor'

test('should create unique id', () => {
  const vm: InstanceConstructor = new InstanceConstructor()
  expect(vm.$id.indexOf('App_')).toBe(0)
})
