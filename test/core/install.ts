import install from '../../src/core/install'
import apps from '../../src/core/apps'

test('should store install definition', () => {
  const definition = {
    data: {}
  }
  install('Foo', definition)
  expect(apps('Foo')).toEqual(definition)
})
