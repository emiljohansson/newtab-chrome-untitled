import jss from 'jss'
import { Subject } from 'rxjs/Subject'

const savedCoor = localStorage.savedWinPos == null
  ? {}
  : JSON.parse(localStorage.savedWinPos)

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

let highestZIndex = 2

const updateZIndex = vm => {
  highestZIndex++
  vm.zIndex = highestZIndex
  vm.$el.style.zIndex = vm.zIndex
}

const mouseMoveSubject = new Subject()
const mouseUpSubject = new Subject()

document.body.addEventListener('mousemove', event => {
  mouseMoveSubject.next(event)
})

document.body.addEventListener('mouseup', event => {
  mouseUpSubject.next(event)
})

const { classes } = jss.createStyleSheet({
  desktopWindow: {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 6px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)',
    minHeight: '200px',
    padding: '4px',
    position: 'absolute',
    zIndex: 2
  },
  content: {
    overflow: 'scroll',
    position: 'relative'
  },
  header: {
    background: '#ccc',
    borderBottom: '1px solid #666',
    borderTopLeftRadius: '3px',
    borderTopRightRadius: '3px',
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
    border: '1px solid #999',
    backgroundColor: 'white',
    borderRadius: '3px',
    padding: '6px',
    margin: '2px 0 0 2px',

    '&:active': {
      backgroundColor: '#eaeaea'
    }
  }
}).attach()

const template = `
<article class="${classes.desktopWindow}" o-class="{
  isDragging: isDragging
}">
  <div class="${classes.header}"
    o-on-mousedown="onMenuMouseDown($event)">
    <div class="${classes.headerLeftButtons}">
      <button class="${classes.closeButton}"
        o-on-mousedown="onPreventMouseEvent($event)"
        o-on-click="onMenuCloseClicked($event)"></button>
    </div>
    <div class="${classes.headerTitle}">
      {{title}}
    </div>
  </div>
  <div class="${classes.content}">
    {{o-content}}
  </div>
</article>
`

const DesktopWindow = {
  template,
  data: {
    index: -1,
    height: 'auto',
    width: 300,
    isDragging: false,
    offsetCoor: {
      x: 0,
      y: 0,
    },
    title: 'Untitled',
    zIndex: -1
  }
}

DesktopWindow.mounted = function () {
  updateZIndex(this)
  const coor = getNewInitCoor(this.$id)
  this.setPosition(coor.x, coor.y)
  this.$el.querySelector(`.${classes.content}`).style.height = `${this.height}px`
  this.$el.style.width = `${this.width}px`

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
    localStorage.savedWinPos = JSON.stringify(savedCoor)
  })
}

DesktopWindow.destroyed = function () {
  this.mouseMoveSubscription.unsubscribe()
  this.mouseUpSubscription.unsubscribe()
}

DesktopWindow.onMenuMouseDown = function (event) {
  this.isDragging = true
  this.offsetCoor.x = this.$el.offsetLeft - event.x
  this.offsetCoor.y = this.$el.offsetTop - event.y
  document.body.style.userSelect = 'none'
  if (this.zIndex !== highestZIndex) {
    updateZIndex(this)
  }
}

DesktopWindow.onMenuCloseClicked = function (event) {
  const arg = this.index < 0
    ? this
    : this.index
  this.$emit('close', arg)
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
