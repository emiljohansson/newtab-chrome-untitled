import jss from 'jss'
import { isFunction } from 'lodash'
import keyboard from 'keyboard-handler'
import * as keyCode from 'keyboard-key-code'
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
<article class="${classes.root}" o-on-click="onClick()">
<div>
  <div o-for="output in outputs">
    <div class="${classes.outputCmd}">{{output.cmd}}</div>
    <div>{{output.out}}</div>
  </div>
</div>
<div o-ref="fieldx" class="${classes.fieldContainer}">
  <input
    class="${classes.field}"
    autofocus
    o-on-keydown="onKeyDown($event)"
  />
</div>
</article>
`

const Terminal = {
  template,
  data: {
    outputs: []
  }
}

Terminal.mounted = function () {
  // TODO only clear if app is in focus
  // TODO add support for focusing an app
  keyboard.keysAreDown([17, 75], () => {
    this.outputs.splice(0, this.outputs.length)
  })

}

Terminal.onClick = function () {
  // focusField(this.$refs.field.$el)
}

Terminal.onKeyDown = function (event) {
  const fieldEl = event.currentTarget // this.$refs.field.$el
  const input = fieldEl.value
  if (keyCode.isEnter(event)) {
    const output = getOutput(input)
    // this.outputs.push(output)
    this.outputs.push({
      cmd: fieldEl.value,
      out: output
    })
    fieldEl.value = ''
    focusField(fieldEl)
    return
  }
}

const focusField = el => {
  el.scrollIntoView()
  el.focus()
}

const getOutput = input => {
  const fn = cmd[input]
  if (isFunction(fn)) {
    return fn()
  }
  return `command not found: ${input}`
}

export default Terminal
