const styles = {
  ':host': {
    fontSize: '2rem'
  }
}

const template = `
<article o-class="{
  active: isActive
}">
  {{message}}
</article>
`

const Template = {
  styles,
  template,
  data: {
    isActive: true,
    message: 'Hello, World!'
  }
}

Template.mounted = function () {
  // this.$el is ready
}

export default Template
