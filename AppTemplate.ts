const styles: any = {
  ':host': {
    fontSize: '2rem'
  }
}

const template: string = `
<article o-class="{
  active: isActive
}">
  {{message}}
</article>
`

const Template: any = {
  styles,
  template,
  data: {
    isActive: true,
    message: 'Hello, World!'
  }
}

Template.mounted = function (): void {
  // this.$el is ready
}

export default Template
