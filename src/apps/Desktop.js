import { isNumber } from 'lodash'
import jss from 'jss'
import keyboard from 'keyboard-handler'
import { classes as weatherClasses } from './Weather'

const styles = {
  desktop: {
    height: 'auto',
    position: 'absolute',
    bottom: '0',
    top: '0',
    left: '0',
    right: '0',
    margin: '20px 16px 16px'
  },
  timeCenter: {
    extend: 'time',
    fontSize: '4rem',
    position: 'absolute',
    marginTop: '-50px',
    top: '50%',
    width: '100%',
    textAlign: 'center'
  }
}
styles.desktop[`& .${weatherClasses.weather}`] = {
  fontSize: '3rem',
  fontWeight: '300',
  position: 'absolute',
  right: '0',
  top: '0'
}

const { classes } = jss.createStyleSheet(styles).attach()

const template = `
<article class="${classes.desktop}">
  <div is="Window"
    title="Times"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="TimeApp"></div>
  </div>
  <div class="${classes.timeCenter}">
    <div is="Time" timezone="America/Denver"></div>
  </div>
  <div is="Window"
    title="Todos"
    height="300"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="Todos"></div>
  </div>
  <div is="Window"
    title="Playground"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="Playground"></div>
  </div>
  <div is="Window"
    title="Puzzle"
    width="190"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="Puzzle"></div>
  </div>
  <div o-for="index in windows"
    is="Window"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow"></div>
  <div o-if="testShow">Hello</div>
  <div is="Window"
    title="Terminal"
    height="200"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="Terminal"></div>
  </div>
</article>
`

let activeWindow

const Desktop = {
  template,
  data: {
    isActive: true,
    windows: [],
    testShow: false
  }
}

Desktop.mounted = function () {
  keyboard.keysAreDown([17, 78], () => {
    const length = this.windows.length
    let index = 0
    if (length > 0) {
      index = this.windows[length - 1].index + 1
    }
    this.windows.push({
      index
    })
  })
}

Desktop.onFocusWindow = function (desktopWindow) {
  if (activeWindow === desktopWindow) {
    return
  }
  if (activeWindow != null) {
    activeWindow.blurWindow()
  }
  activeWindow = desktopWindow
  activeWindow.focusWindow()
}

Desktop.onCloseWindow = function (arg) {
  if (isNumber(arg)) {
    this.windows.splice(arg, 1)
    return
  }
  arg.$destroy()
}

export default Desktop
