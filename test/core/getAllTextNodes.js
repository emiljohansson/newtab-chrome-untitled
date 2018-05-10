import test from 'ava'
import getAllTextNodes from 'core/getAllTextNodes'

test('should find text nodes from element', t => {
  const el = document.createElement('div')
  el.innerHTML = `Foo`
  const nodes = getAllTextNodes(el)
  t.is(nodes[0].textContent.trim(), 'Foo')
})

test('should find text nodes from element and children', t => {
  const el = document.createElement('div')
  el.innerHTML = `
Foo
<span>Child</span>
Bar
`
  const nodes = getAllTextNodes(el)
  t.is(nodes[0].textContent.trim(), 'Foo')
  t.is(nodes[1].textContent.trim(), 'Bar')
  t.is(nodes[2].textContent.trim(), 'Child')
})

test('should find text nodes from shadow dom', t => {
  const el = document.createElement('div')
  el.attachShadow({
    mode: 'open'
  }).innerHTML = `
Foo
<span>Child</span>
Bar
`

  const nodes = getAllTextNodes(el)
  t.is(nodes[0].textContent.trim(), 'Foo')
  t.is(nodes[1].textContent.trim(), 'Bar')
  t.is(nodes[2].textContent.trim(), 'Child')
})
