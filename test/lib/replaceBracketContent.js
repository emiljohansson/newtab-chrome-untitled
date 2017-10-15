import test from 'ava'
import replaceBracketContent from 'lib/replaceBracketContent'

test('should do no-operations', t => {
  t.is(replaceBracketContent(`
    {{text}} - {{completed}}
`, 'Foo', 'text'), `
    Foo - {{completed}}
`)
})
