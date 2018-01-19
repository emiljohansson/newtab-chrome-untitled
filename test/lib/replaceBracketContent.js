import test from 'ava'
import replaceBracketContent from 'lib/replaceBracketContent'

test('should do no-operations', t => {
  t.is(replaceBracketContent(`
    {{text}} - {{completed}}
`, 'Foo', 'text'), `
    Foo - {{completed}}
`)
})

test('should return string from plain object', t => {
  const foo = {
    bar: 'hello'
  }
  t.is(replaceBracketContent(`
    {{foo.bar}}
`, foo, 'foo.bar', 'foo'), `
    hello
`)
})
