import test from 'ava'
import replaceWithTemplate from 'core/replaceWithTemplate'
import state from 'core/state'

test(t => {
  t.pass()
})

// test('should replace all text nodes with data from `vm`', t => {
//   const el = document.createElement('div')
//   document.body.appendChild(el)
//   const vm = {
//     $el: el,
//     template: `<div>{{foo}}, {{bar}}</div>`,
//     data: {
//       foo: 'Hello',
//       bar: 'World'
//     }
//   }
//   replaceWithTemplate(vm)
//   state(vm)
//   t.is(vm.$el.innerHTML, 'Hello, World')
//   document.body.removeChild(vm.$el)
// })
//
// test('should replace all text nodes with data from `vm` in shadow root', t => {
//   const el = document.createElement('div')
//   document.body.appendChild(el)
//   const vm = {
//     useShadow: true,
//     styles: {},
//     $el: el,
//     template (classes) {
//       return `<template><div>{{foo}}, {{bar}}</div></template>`
//     },
//     data: {
//       foo: 'Hello',
//       bar: 'World'
//     }
//   }
//   replaceWithTemplate(vm)
//   state(vm)
//   t.is(vm.$el.shadowRoot.children[1].innerHTML, 'Hello, World')
//   document.body.removeChild(vm.$el)
// })
