import getAllTextNodes from '../../src/core/getAllTextNodes'

test('should find text nodes from element', () => {
  const el = document.createElement('div')
  el.innerHTML = `Foo`
  const nodes = getAllTextNodes(el)
  expect(nodes[0].textContent.trim()).toBe('Foo')
})

test('should find text nodes from element and children', () => {
  const el = document.createElement('div')
  el.innerHTML = `
Foo
<span>Child</span>
Bar
`
  const nodes = getAllTextNodes(el)
  expect(nodes[0].textContent.trim()).toBe('Foo')
  expect(nodes[1].textContent.trim()).toBe('Bar')
  expect(nodes[2].textContent.trim()).toBe('Child')
})

test('should find text nodes from shadow dom', () => {
  const el = document.createElement('div')
  el.attachShadow({
    mode: 'open'
  }).innerHTML = `
Foo
<span>Child</span>
Bar
`

  const nodes = getAllTextNodes(el)
  expect(nodes[0].textContent.trim()).toBe('Foo')
  expect(nodes[1].textContent.trim()).toBe('Bar')
  expect(nodes[2].textContent.trim()).toBe('Child')
})
