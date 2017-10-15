import test from 'ava'
import findKeysInTemplate from 'core/findKeysInTemplate'

test('should find all curly backet keys', t => {
  const template = `{{foo}} {{bar}}`
  const keys = findKeysInTemplate(template)
  t.deepEqual(keys, ['foo', 'bar'])
})
