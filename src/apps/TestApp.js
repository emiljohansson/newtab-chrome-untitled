const styles = {
  '@global :host': {
    background: 'yellow'
  },
  a: {
    background: 'red'
  },
  b: {
    background: 'blue'
  }
}

const template = classes => `
<template>
  <header class="${classes.b}">Header</header>
  <div is="TestComponent" class="blue-guy">
    In test component
  </div>
  <slot></slot>
</template>
`

const TestApp = {
  debug: true,
  useShadow: true,
  styles,
  template,
  data: {}
}

TestApp.mounted = function () {
  console.log('mounted')
}

export default TestApp
