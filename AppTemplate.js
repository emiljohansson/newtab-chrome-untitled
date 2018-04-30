const styles = {
  '@global :host': {
    fontSize: '2rem'
  }
}

const template = classes => `
<template>
  <article o-class="{
    active: isActive
  }">
  </article>
</template>
`

const Template = {
  styles,
  template,
  data: {
    isActive: true
  }
}

Template.mounted = function () {
  // this.$el is ready
}

export default Template
