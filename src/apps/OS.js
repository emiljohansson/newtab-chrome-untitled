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
  data: {}
}

export const fileSystem = {
  getDir (path) {
    if (path === '/') {
      return fileSystem[path]
    }
    const paths = path.split('/').slice(1)
    let currentDir = this['/']
    const length = paths.length
    let index = -1
    while (++index < length) {
      currentDir = currentDir[paths[index]]
      if (currentDir == null) {
        return
      }
    }
    return currentDir
  },
  '/': {
    'Applications': {},
    'Users': {
      'admin': []
    }
  }
}

export const installApp = (definition, App) => {
  fileSystem['/']['Applications'][definition] = App
}

export default OS
