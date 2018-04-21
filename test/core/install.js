import test from 'ava'
import apps from 'core/apps'
import install from 'core/install'

test('should store install definition', t => {
  const definition = {
    data: {}
  }
  install('Foo', definition)
  t.deepEqual(apps('Foo'), definition)
})
