import { forEach, isFunction, remove } from 'lodash'
import * as keyboardHandler from 'keyboard-handler'

const styles = {
  ':host': {
    height: 'auto',
    position: 'absolute',
    bottom: '0',
    top: '0',
    left: '0',
    right: '0',
    margin: '1rem',
    marginTop: '20px'
  },
  timeCenter: {
    fontSize: '4rem',
    position: 'absolute',
    marginTop: '-50px',
    top: '50%',
    width: '100%',
    textAlign: 'center'
  }
}

const template = `
<div is="Window"
  title="Puzzle"
  width="198"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="Puzzle"></div>
</div>
<div class="timeCenter">
  <div is="Time" timezone="America/Denver"></div>
</div>
<div is="Window"
  title=""
  width="218"
  height="300"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="WeatherApp"></div>
</div>
<div is="Window"
  title=""
  height="300"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="Todos"></div>
</div>
<div is="Window"
  title=""
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="TimeApp"></div>
</div>
<div is="Window"
  title="Playground"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="Playground"></div>
</div>
<div is="Window"
  title="Terminal"
  height="200"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow">
  <div is="Terminal"></div>
</div>

<div o-for="index in windows"
  is="Window"
  o-emit-focus="onFocusWindow"
  o-emit-close="onCloseWindow"></div>
`

const zIndexList: any[] = []
let activeWindow: any
let highestZIndex: number = 2

const removeAt = (array, index) => remove(array, (n, i) => i === index)

const moveToEnd = (array, index) => {
  const item = array.splice(index, 1)[0]
  array.push(item)
}

const updateZIndex = (desktopWindow: any) => {
  const index: number = zIndexList.indexOf(desktopWindow)
  highestZIndex++
  desktopWindow.$host.style.zIndex = highestZIndex
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

const Desktop: any = {
  styles,
  template,
  data: {
    isActive: true,
    windows: []
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

Desktop.onFocusWindow = function (desktopWindow: any) {
  this.focusWindow(desktopWindow)
}

Desktop.focusWindow = function (desktopWindow: any) {
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

Desktop.onCloseWindow = function (desktopWindow: any, index: number) {
  this.removeWindow(desktopWindow, index)
}

Desktop.removeWindow = function (desktopWindow: any, index: number) {
  removeFromZIndex(desktopWindow)
  if (index > -1) {
    this.windows.splice(index, 1)
    return
  }
  desktopWindow.$destroy()
}

export const keyboard: any = {}

forEach(Object.keys(keyboardHandler), key => {
  const method = keyboardHandler[key]
  if (!isFunction(method)) {
    return
  }
  keyboard[key] = function (...args: any[]) {
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
