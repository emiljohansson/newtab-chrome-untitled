import test from 'ava'
import JssStyleSheet from 'stylesheet'
import StyleSheet from 'stylesheet/s'

test('should create a style sheet', t => {
  const expected = {'red': 'red-0-1', 'blue': 'blue-0-2'}
  const styleSheet = JssStyleSheet({
    red: {},
    blue: {}
  })
  t.deepEqual(styleSheet.classes, expected)
})

const attachStyle = styleSheet => {
  const el = document.createElement('div')
  styleSheet.attach(el)
  return el.firstChild.innerHTML
}

test('attach: should attach a style element', t => {
  const expected = `.blue {
}
.red {
}`
  const styleSheet = StyleSheet({
    blue: {},
    red: {}
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('classes: should kebab case properties', t => {
  const expected = `.blue {
font-size: 1rem;
}
.red {
border-color: red;
height: 0;
width: 100%;
}`
  const styleSheet = StyleSheet({
    blue: {
      fontSize: '1rem'
    },
    red: {
      borderColor: 'red',
      height: 0,
      width: '100%'
    }
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('classes: should add pseudo', t => {
  const expected = `:host {
font-size: 1rem;
}`
  const styleSheet = StyleSheet({
    ':host': {
      fontSize: '1rem'
    }
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('classes: should extend style', t => {
  const expected = `.bar {
display: block;
font-size: 1rem;
}`
  const foo = {
    display: 'block'
  }
  const styleSheet = StyleSheet({
    bar: {
      extend: foo,
      fontSize: '1rem'
    }
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})
