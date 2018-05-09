import { forEach, isFunction } from 'lodash'
import { Subject } from 'rxjs/Subject'

const savedCoor = window.localStorage.savedWinPos == null
  ? {}
  : JSON.parse(window.localStorage.savedWinPos)

const initCoor = {
  x: 0,
  y: 0
}

const getNewInitCoor = (id) => {
  if (savedCoor[id] != null) {
    return savedCoor[id]
  }
  const coor = Object.assign({}, initCoor)
  savedCoor[id] = coor
  initCoor.x += 20
  initCoor.y += 20
  if (initCoor.x > 200) {
    initCoor.x = 0
    initCoor.y = 0
  }
  return coor
}

const mouseMoveSubject = new Subject()
const mouseUpSubject = new Subject()

document.body.addEventListener('mousemove', event => {
  mouseMoveSubject.next(event)
})

document.body.addEventListener('mouseup', event => {
  mouseUpSubject.next(event)
})

const styles = {
  '@global :host': {
    backgroundColor: '#f5f5f5',
    border: '1px solid #ccc',
    borderRadius: '3px',
    boxShadow: '0 2px 6px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)',
    display: 'flex',
    minHeight: '200px',
    padding: '0.25rem',
    position: 'absolute',
    zIndex: 2
  },
  desktopWindow: {
    flex: 1,

    '&:hover $closeButton': {
      opacity: 1
    }
  },
  content: {
    overflow: 'scroll',
    position: 'relative'
  },
  header: {
    background: 'transparent',
    borderBottom: '1px solid transparent',
    borderTopLeftRadius: '1px',
    borderTopRightRadius: '1px',
    height: '19px',
    margin: '-4px',
    marginBottom: '4px',
    position: 'relative'
  },
  headerCol: {
    fontSize: '0.8rem',
    position: 'absolute',
    zIndex: 2
  },
  headerButtons: {
    extend: 'headerCol',
    lineHeight: 0
  },
  headerLeftButtons: {
    extend: 'headerButtons'
  },
  headerRightButtons: {
    extend: 'headerButtons'
  },
  headerTitle: {
    extend: 'headerCol',
    cursor: 'default',
    textAlign: 'center',
    width: '100%',
    zIndex: 1
  },
  closeButton: {
    border: '0px solid',
    backgroundColor: '#ff7868',
    borderRadius: '10px',
    padding: '6px',
    margin: '3px 0 0 3px',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',

    '&:active': {
      backgroundColor: '#eaeaea'
    }
  }
}

const template = classes => `
<article class="${classes.desktopWindow}"
  o-class="{
    isDragging: isDragging
  }"
  o-on-click="onWindowClick()"
>
  <header class="${classes.header}"
    o-on-mousedown="onMenuMouseDown($event)">
    <div class="${classes.headerLeftButtons}">
      <button class="${classes.closeButton}"
        o-on-mousedown="onPreventMouseEvent($event)"
        o-on-click="onMenuCloseClick($event)">
      </button>
    </div>
    <div class="${classes.headerTitle}">
      {{title}}
    </div>
  </header>
  <main class="${classes.content}">
    <slot></slot>
  </main>
</article>`

const DesktopWindow = {
  styles,
  template,
  data: {
    isWindow: true,
    index: -1,
    height: 'auto',
    width: 300,
    isDragging: false,
    offsetCoor: {
      x: 0,
      y: 0
    },
    title: 'Untitled',
    zIndex: -1
  }
}

DesktopWindow.created = function () {}

DesktopWindow.mounted = function () {
  const coor = getNewInitCoor(this.$id)
  this.setPosition(coor.x, coor.y)
  this.$el.shadowRoot.querySelector(`main`).style.height = `${this.height}px`
  this.$el.style.width = `${this.width}px`

  forEach(this.$children, $child => {
    const settings = $child.windowSettings
    if (settings == null) {
      return
    }
    const update = settings => {
      if (settings.transition) {
        this.$el.style.transition = settings.transition
      }
      if (settings.background) {
        this.$el.style.background = settings.background
      }
      if (settings.backgroundPositionX) {
        this.$el.style.backgroundPositionX = settings.backgroundPositionX
      }
    }
    update(settings)
    settings.update = update
  })

  this.mouseMoveSubscription = mouseMoveSubject.subscribe(event => {
    if (!this.isDragging) {
      return
    }
    const x = event.x + this.offsetCoor.x
    const y = event.y + this.offsetCoor.y
    this.setPosition(x, y)
  })

  this.mouseUpSubscription = mouseUpSubject.subscribe(event => {
    if (!this.isDragging) {
      return
    }
    this.isDragging = false
    document.body.style.userSelect = ''
    window.localStorage.savedWinPos = JSON.stringify(savedCoor)
    this.focusWindow()
  })
}

DesktopWindow.destroyed = function () {
  this.mouseMoveSubscription.unsubscribe()
  this.mouseUpSubscription.unsubscribe()
}

DesktopWindow.blurWindow = function () {
  const $child = this.$children[0]
  if ($child == null || !isFunction($child.windowBlurred)) {
    return
  }
  $child.windowBlurred()
}

DesktopWindow.focusWindow = function () {
  const $child = this.$children[0]
  if ($child == null || !isFunction($child.windowFocused)) {
    return
  }
  $child.windowFocused()
}

DesktopWindow.onWindowClick = function (event) {
  this.$emit('focus', this)
}

DesktopWindow.onMenuMouseDown = function (event) {
  this.isDragging = true
  this.offsetCoor.x = this.$el.offsetLeft - event.x
  this.offsetCoor.y = this.$el.offsetTop - event.y
  document.body.style.userSelect = 'none'
  this.$emit('focus', this)
}

DesktopWindow.onMenuCloseClick = function (event) {
  this.$emit('close', this, this.index)
}

DesktopWindow.onPreventMouseEvent = function (event) {
  event.preventDefault()
  event.stopPropagation()
}

DesktopWindow.setPosition = function (x, y) {
  if (x > document.body.offsetWidth) {
    x = document.body.offsetWidth - this.width
  }
  if (y > document.body.offsetHeight) {
    y = document.body.offsetHeight - this.height
  }
  const coor = {
    x
  }
  this.$el.style.left = `${x}px`
  if (y >= 0) {
    this.$el.style.top = `${y}px`
    coor.y = y
  }
  savedCoor[this.$id] = coor
}

export default DesktopWindow
