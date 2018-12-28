import { html, render } from '../../src/core/plain-html'

test('should render template', () => {
  expect(render('')).toBeUndefined()

  const el: HTMLElement = document.createElement('div')
  const template: any = html`<div>Hello</div>`
  render(template, el)

  expect(el.innerHTML).toBe('<div>Hello</div>')

  const sayHello: any = html`<h1>Hello ${'lname'}, ${'fname'}</h1>`
  render(sayHello({
    fname: 'John',
    lname: 'Smith'
  }), el)
  expect(el.innerHTML).toBe('<h1>Hello Smith, John</h1>')

  const accountInfo: any = html`<article>
  <div>First name: ${'fname'}</div>
  <div>Last name: ${'lname'}</div>
</article>`
  render(accountInfo({
    fname: 'John',
    lname: 'Smith'
  }), el)
  expect(el.innerHTML).toBe(`<article>
  <div>First name: John</div>
  <div>Last name: Smith</div>
</article>`)
})
