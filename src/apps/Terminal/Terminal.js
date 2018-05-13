import { isFunction } from '../../../node_modules/lodash-es/lodash.js'
import { isEnter } from '../../../node_modules/keyboard-key-code/index.js'
import { keyboard } from '../Desktop.js'
import extendWindowApp from '../WindowApp.js'
import * as cmd from '../Terminal/cmd.js'

const styles = {
  ':host': {
    fontSize: '0.7rem'
  },
  field: {
    display: 'flex',
    fontSize: '1.2rem',

    '&:before': {
      content: '"›"',
      paddingRight: '7px'
    }
  },
  input: {
    border: '0',
    outline: 'none',
    padding: '10px 0',
    width: '100%'
  },
  outputCmd: {
    '&:before': {
      content: '"›"',
      fontSize: '1.2rem',
      paddingRight: '7px'
    }
  }
}

const template = `
<div>
  <div o-for="output in outputs">
    <div class="outputCmd">{{output.cmd}}</div>
    <div>{{output.out}}</div>
  </div>
</div>
<div class="field">
  <input
    class="input"
    o-ref="field"
    o-on-keydown="onKeyDown($event)"
  />
</div>
`

const Terminal = extendWindowApp('Terminal', {
  styles,
  template,
  data: {
    outputs: []
  }
})

Terminal.mounted = function () {
  keyboard.keysAreDown(this, [17, 75], () => {
    this.outputs.splice(0, this.outputs.length)
  })
}

Terminal.windowFocused = function () {
  this.focusField()
}

Terminal.onKeyDown = function (event) {
  const fieldEl = event.currentTarget
  const input = fieldEl.value
  if (isEnter(event)) {
    const output = getOutput(input)
    this.outputs.push({
      cmd: fieldEl.value,
      out: output
    })
    fieldEl.value = ''
    this.focusField()
    // return
  }
}

Terminal.focusField = function () {
  this.$refs.field.scrollIntoView()
  this.$refs.field.focus()
}

const getOutput = input => {
  const args = input.split(' ')
  const fn = cmd[args[0]]
  if (isFunction(fn)) {
    return fn.apply(null, args.slice(1))
  }
  return `command not found: ${input}`
}

export default Terminal
