const styles = {
  '@global :host': {
    background: 'orange'
  }
}

const template = classes => `
<template>
  <header o-on-click="onClick">Header</header>
  <slot></slot>
</template>
`

const TestComponent = {
  debug: false,
  useShadow: true,
  styles,
  template,
  data: {}
}

TestComponent.mounted = function () {
  console.log('mounted')
}

TestComponent.onClick = function () {
  console.log('click')
}

export default TestComponent
