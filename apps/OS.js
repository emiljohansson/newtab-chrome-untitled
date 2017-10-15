import jss from 'jss'

const { classes } = jss.createStyleSheet({
  os: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
}).attach()

const template = `
<article class="${classes.os}">
  <div is="StatusBar"></div>
  <div is="Desktop"></div>
</article>
`

const OS = {
  template,
  data: {
    isActive: true
  }
}

export default OS
