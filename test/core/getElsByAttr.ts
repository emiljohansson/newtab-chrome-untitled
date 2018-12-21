import getElsByAttr from '../../src/core/getElsByAttr'

test('should find all elements by attribute', () => {
  const el = document.createElement('div')
  const childEl = document.createElement('div')
  childEl.setAttribute('o-for', 'x in y')
  el.appendChild(childEl)
  const expected = [
    childEl
  ]
  const actual = getElsByAttr(el, `o-for`)
  expect(actual).toEqual(expected)
})

test('should do nothing', () => {
  const expected = []
  const actual = getElsByAttr(null, `o-for`)
  expect(actual).toEqual(expected)
})
