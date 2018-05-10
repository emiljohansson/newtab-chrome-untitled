const styles = {
  '@global :host': {
    background: 'linear-gradient(to bottom, #ffffff 0%,#f6f6fa 100%)',
    height: '100%',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
}

const template = `
<div is="StatusBar"></div>
<div is="Desktop"></div>
`

const OS = {
  styles,
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
