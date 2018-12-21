import replaceBracketContent from "../../src/core/replaceBracketContent"

test('should do no-operations', () => {
  expect(replaceBracketContent(`
    {{text}} - {{completed}}
`, 'Foo', 'text')).toBe(`
    Foo - {{completed}}
`)
})

test('should return string from plain object', () => {
  const foo = {
    bar: 'hello'
  }
  expect(replaceBracketContent(`
    {{foo.bar}}
`, foo, 'foo.bar', 'foo')).toBe(`
    hello
`)
})
