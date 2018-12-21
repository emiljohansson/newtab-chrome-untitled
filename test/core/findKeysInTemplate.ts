import findKeysInTemplate from '../../src/core/findKeysInTemplate'

test('should find all curly backet keys', () => {
  const template = `{{foo}} {{bar}}`
  const keys = findKeysInTemplate(template)
  expect(keys).toEqual(['foo', 'bar'])
})
