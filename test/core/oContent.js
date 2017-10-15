import test from 'ava'
import oContent from 'core/oContent'

test('should do nothing', t => {
  const vm = {}
  oContent(vm)
  t.pass()
})

test('should replce {{o-content}} with inner html', t => {
  const el = document.createElement('div')
  el.innerHTML = `
  <span></span>
  {{o-content}}
  <div></div>
`
  document.body.appendChild(el)
  const nodeLength = el.childNodes.length
  const vm = {
    $el: el
  }
  oContent(vm, `<div>Hello</div>`)
  t.is(vm.$el.children.length, 3)
  t.is(vm.$el.childNodes.length, nodeLength)
  document.body.removeChild(el)
})

test('should replce {{o-content}} placed in sub child', t => {
  const el = document.createElement('div')
  el.innerHTML = `
  <span></span>
  <div>{{o-content}}</div>
  <div></div>
`
  document.body.appendChild(el)
  const nodeLength = el.childNodes.length
  const vm = {
    $el: el
  }
  oContent(vm, `<div>Hello</div>`)
  t.is(vm.$el.children.length, 3)
  t.is(vm.$el.childNodes.length, nodeLength)
  document.body.removeChild(el)
})

test('should remove {{o-content}} if no content are passed', t => {
  const el = document.createElement('div')
  el.innerHTML = `
  <span></span>
  <div>{{o-content}}</div>
  <div></div>
`
  document.body.appendChild(el)
  const nodeLength = el.childNodes.length
  const vm = {
    $el: el
  }
  oContent(vm)
  t.true(vm.$el.innerHTML.indexOf('{{o-content}}') < 0)
  document.body.removeChild(el)
})
