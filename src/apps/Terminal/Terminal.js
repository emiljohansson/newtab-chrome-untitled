import jss from 'jss'
import { isFunction } from 'lodash'
import * as keyCode from 'keyboard-key-code'
import { keyboard } from 'apps/Desktop'
import extendWindowApp from 'apps/WindowApp'
import * as cmd from 'apps/Terminal/cmd'

const { classes } = jss.createStyleSheet({
  root: {
    fontSize: '0.7rem'
  },
  fieldContainer: {
    position: 'relative',
    fontSize: '1.2rem',

    '&:before': {
      content: '"›"',
      paddingRight: '7px'
    }
  },
  field: {
    border: '0',
    outline: 'none',
    padding: '10px 0',
    position: 'absolute',
    width: '100%'
  },
  outputCmd: {
    '&:before': {
      content: '"›"',
      fontSize: '1.2rem',
      paddingRight: '7px'
    }
  }
}).attach()

const template = `
<article class="${classes.root}">
<div>
  <div o-for="output in outputs">
    <div class="${classes.outputCmd}">{{output.cmd}}</div>
    <div>{{output.out}}</div>
  </div>
</div>
<div class="${classes.fieldContainer}">
  <input
    class="${classes.field}"
    o-ref="field"
    o-on-keydown="onKeyDown($event)"
  />
</div>
</article>
`

const Terminal = extendWindowApp('Terminal', {
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
  if (keyCode.isEnter(event)) {
    const output = getOutput(input)
    this.outputs.push({
      cmd: fieldEl.value,
      out: output
    })
    fieldEl.value = ''
    this.focusField()
    return
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
