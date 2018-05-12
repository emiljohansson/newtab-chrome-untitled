import { filter, forEach, reduce } from 'lodash'
import extendWindowApp from 'apps/WindowApp'

const styles = {
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

const template = `
<div is="PuzzleItem"
  o-for="context in values"
  o-emit-click="onItemClick"></div>
<div is="PuzzleItem"
  class="hello blankColumn"
  o-ref="blankItem">
</div>
`

const numberOfValues = 15

const swapEl = (el1, el2) => {
  const tempEl = document.createElement('div')
  el1.parentNode.insertBefore(tempEl, el1)
  el2.parentNode.insertBefore(el1, el2)
  tempEl.parentNode.insertBefore(el2, tempEl)
  tempEl.parentNode.removeChild(tempEl)
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
  const length = this.$children.length

  // shuffle
  let index = -1
  while (++index < 20) {
    const r1 = parseInt(Math.random() * length, 10)
    const r2 = parseInt(Math.random() * length, 10)
    const el1 = this.$el.children[r1]
    const el2 = this.$el.children[r2]
    swapEl(el1, el2)
  }
}

Puzzle.onItemClick = function (el) {
  let blankIndex = 0
  let selectedIndex = 0
  const blankEl = this.$refs.blankItem.$host
  forEach(this.$el.children, (childEl, index) => {
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
  console.log(winner ? 'winner winner chicken dinner' : 'not yet...')
}

export default Puzzle
