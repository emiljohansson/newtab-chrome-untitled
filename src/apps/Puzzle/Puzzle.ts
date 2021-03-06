import { filter, forEach, reduce } from 'lodash'
import extendWindowApp from '../WindowApp'

const styles: any = {
  ':host': {
    fontSize: '2rem',
    textAlign: 'center',
    userSelect: 'none'
  },
  item: {
    float: 'left',
    height: '45px',
    width: '45px'
  },
  blankColumn: {
    backgroundColor: '#e3e3e3'
  }
}

const template: string = `
<div is="PuzzleItem"
  o-for="context in values"
  o-emit-click="onItemClick"></div>
<div is="PuzzleItem"
  class="hello blankColumn"
  o-ref="blankItem">
</div>
`

const numberOfValues: number = 15

const swapEl = (el1: HTMLElement, el2: HTMLElement) => {
  const tempEl: HTMLElement = document.createElement('div')
  el1.parentNode!.insertBefore(tempEl, el1)
  el2.parentNode!.insertBefore(el1, el2)
  if (tempEl.parentNode) {
    tempEl.parentNode.insertBefore(el2, tempEl)
    tempEl.parentNode.removeChild(tempEl)
  }
}

const Puzzle = extendWindowApp('Puzzle', {
  styles,
  template,
  data: {
    values: null
  }
})

Puzzle.beforeCreate = function () {
  this.data.values = []
  let value = 0
  while (++value <= numberOfValues) {
    this.data.values.push({
      value
    })
  }
}

Puzzle.mounted = function () {
  const length: number = this.$children.length

  // shuffle
  let index: number = -1
  while (++index < 20) {
    const r1: number = parseInt((Math.random() * length).toString(), 10)
    const r2: number = parseInt((Math.random() * length).toString(), 10)
    const el1 = this.$el.children[r1]
    const el2 = this.$el.children[r2]
    swapEl(el1, el2)
  }
}

Puzzle.onItemClick = function (el: HTMLElement) {
  let blankIndex = 0
  let selectedIndex = 0
  const blankEl = this.$refs.blankItem.$host
  forEach(this.$el.children, (childEl, index: number) => {
    if (childEl === blankEl) {
      blankIndex = index
    }
    if (childEl === el) {
      selectedIndex = index
    }
  })
  if (selectedIndex !== blankIndex - 1 &&
      selectedIndex !== blankIndex + 1 &&
      selectedIndex !== blankIndex - 4 &&
      selectedIndex !== blankIndex + 4) {
    return
  }
  swapEl(el, blankEl)

  // validate
  if (selectedIndex !== numberOfValues) {
    return
  }
  let winner = true
  const children = filter(this.$el.children, el => el.tagName !== 'STYLE')
  reduce(children, (value, childEl) => {
    const elValue = parseInt(childEl.shadowRoot.firstChild.innerHTML, 10)
    if (!winner) {
      return -1
    }
    if (elValue < value) {
      winner = false
    }
    return elValue
  }, -1)
  // tslint:disable-next-line:no-console
  console.log(winner ? 'winner winner chicken dinner' : 'not yet...')
}

export default Puzzle
