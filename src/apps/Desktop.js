import { forEach, isFunction, isNumber } from 'lodash'
import jss from 'jss'
import keyboardHandler from 'keyboard-handler'
import moveToEnd from 'array-movetoend'
import removeAt from 'array-removeat'
import { classes as weatherClasses } from './Weather'
import * as spacing from 'style/spacing'

const styles = {
  desktop: {
    height: 'auto',
    position: 'absolute',
    bottom: '0',
    top: '0',
    left: '0',
    right: '0',
    margin: spacing.inset.m,
    marginTop: '20px'
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
// styles.desktop[`& .${weatherClasses.weather}`] = {
//   fontSize: '3rem',
//   fontWeight: '300',
//   position: 'absolute',
//   right: '0',
//   top: '0'
// }

const { classes } = jss.createStyleSheet(styles).attach()

const template = `
<article class="${classes.desktop}">
  <div class="${classes.timeCenter}">
    <div is="Time" timezone="America/Denver"></div>
  </div>
  <div o-for="index in windows"
    is="Window"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow"></div>
  <div is="Window"
    title=""
    width="218"
    height="300"
    o-emit-focus="onFocusWindow"
    o-emit-close="onCloseWindow">
    <div is="WeatherApp"></div>
  </div>
</article>
`

// <div is="Window"
//   title=""
//   o-emit-focus="onFocusWindow"
//   o-emit-close="onCloseWindow">
//   <div is="TimeApp"></div>
// </div>
// <div is="Window"
//   title="Todos"
//   height="300"
//   o-emit-focus="onFocusWindow"
//   o-emit-close="onCloseWindow">
//   <div is="Todos"></div>
// </div>
// <div is="Window"
//   title="Playground"
//   o-emit-focus="onFocusWindow"
//   o-emit-close="onCloseWindow">
//   <div is="Playground"></div>
// </div>
// <div is="Window"
//   title="Puzzle"
//   width="190"
//   o-emit-focus="onFocusWindow"
//   o-emit-close="onCloseWindow">
//   <div is="Puzzle"></div>
// </div>
// <div o-if="testShow">Hello</div>
// <div is="Window"
//   title="Terminal"
//   height="200"
//   o-emit-focus="onFocusWindow"
//   o-emit-close="onCloseWindow">
//   <div is="Terminal"></div>
// </div>

const zIndexList = []
let activeWindow
let highestZIndex = 2

const updateZIndex = desktopWindow => {
  const index = zIndexList.indexOf(desktopWindow)
  highestZIndex++
  desktopWindow.$el.style.zIndex = highestZIndex
  if (index < 0) {
    zIndexList.push(desktopWindow)
  } else {
    moveToEnd(zIndexList, index)
  }
}

const removeFromZIndex = desktopWindow => {
  const index = zIndexList.indexOf(desktopWindow)
  if (index > -1) {
    removeAt(zIndexList, index)
  }
}

const Desktop = {
  template,
  data: {
    isActive: true,
    windows: [],
    testShow: false
  }
}

Desktop.mounted = function () {
  forEach(this.$children, $child => {
    if ($child.isWindow === true) {
      updateZIndex($child)
    }
  })
  keyboardHandler.keysAreDown([17, 78], () => {
    const length = this.windows.length
    let index = 0
    if (length > 0) {
      index = this.windows[length - 1].index + 1
    }
    this.windows.push({
      index
    })

    // TODO use nextTick
    if (isFunction(this.focusWindow)) {
      this.focusWindow(this.$children[this.$children.length - 1])
    }
  })

  keyboardHandler.keysAreDown([17, 87], () => {
    const index = zIndexList.length - 1
    if (index < 0) {
      return
    }
    this.removeWindow(zIndexList[index])
  })
}

Desktop.onFocusWindow = function (desktopWindow) {
  this.focusWindow(desktopWindow)
}

Desktop.focusWindow = function (desktopWindow) {
  if (activeWindow === desktopWindow) {
    return
  }
  if (activeWindow != null) {
    activeWindow.blurWindow()
  }
  activeWindow = desktopWindow
  if (isFunction(activeWindow.focusWindow)) {
    activeWindow.focusWindow()
  }
  updateZIndex(desktopWindow)
}

Desktop.onCloseWindow = function (desktopWindow, index) {
  this.removeWindow(desktopWindow, index)
}

Desktop.removeWindow = function (desktopWindow, index) {
  removeFromZIndex(desktopWindow)
  if (index > -1) {
    this.windows.splice(index, 1)
    return
  }
  desktopWindow.$destroy()
}

export const keyboard = {}

forEach(Object.keys(keyboardHandler), key => {
  const method = keyboardHandler[key]
  if (!isFunction(method)) {
    return
  }
  keyboard[key] = function (...args) {
    const app = args[0]
    const params = args[1]
    const callback = args[2]
    method(params, () => {
      if (activeWindow !== app.$parent) {
        return
      }
      callback()
    })
  }
})

export default Desktop
