import jss from 'jss'

const { classes } = jss.createStyleSheet({
  root: {
    fontSize: '2rem'
  }
}).attach()

const template = `
<article class="${classes.root}" o-class="{
  active: isActive
}">
</article>
`

const Template = {
  template,
  data: {
    isActive: true
  }
}

Template.mounted = function () {
  // this.element is ready
}

export default Template
