import test from 'ava'
import apps from 'core/apps'
import app from 'core/app'

test('should store app definition', t => {
  const definition = {
    data: {}
  }
  app('Foo', definition)
  t.deepEqual(apps('Foo'), definition)
})
