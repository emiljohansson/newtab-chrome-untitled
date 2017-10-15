import test from 'ava'
import getElsByAttr from 'lib/getElsByAttr'

test('should find all elements by attribute', t => {
  const el = document.createElement('div')
  const childEl = document.createElement('div')
  childEl.setAttribute('o-for', 'x in y')
  el.appendChild(childEl)
  const expected = [
    childEl
  ]
  const actual = getElsByAttr(el, `o-for`)
  t.deepEqual(actual, expected)
})

test('should do nothing', t => {
  const expected = []
  const actual = getElsByAttr(null, `o-for`)
  t.deepEqual(actual, expected)
})
