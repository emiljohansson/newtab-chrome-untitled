const styles = {}

const template = classes => `
<template>
  <header>Header</header>
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

export default TestComponent
