import test from 'ava'
import StyleSheet from 'core/styleSheet'

const attachStyle = styleSheet => {
  const el = document.createElement('div')
  styleSheet.attach(el)
  if (el.firstChild == null) {
    return null
  }
  return el.firstChild.innerHTML
}

test('attach: should attach a style element', t => {
  const expected = `
.blue {
}

.red {
}
`
  const styleSheet = StyleSheet({
    blue: {},
    red: {}
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('attach: should NOT attach when empty', t => {
  const styleSheet = StyleSheet({})
  const content = attachStyle(styleSheet)
  t.is(content, null)
})

test('classes: should kebab case properties', t => {
  const expected = `
.blue {
font-size: 1rem;
}

.red {
border-color: red;
height: 0;
width: 100%;
}
`
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
  const expected = `
:host {
font-size: 1rem;
}
`
  const styleSheet = StyleSheet({
    ':host': {
      fontSize: '1rem'
    }
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('classes: should replace & with current scope', t => {
  const expected = `
.foo {
font-size: 1rem;
}
.foo:hover {
background: blue;
}

.bar .foo {
border: 1px;
}
`
  const styleSheet = StyleSheet({
    foo: {
      fontSize: '1rem',

      '&:hover': {
        background: 'blue'
      },

      '.bar &': {
        border: '1px'
      }
    }
  })
  const content = attachStyle(styleSheet)
  t.is(content, expected)
})

test('classes: should extend style', t => {
  const expected = `
.bar {
display: block;
font-size: 1rem;
}
`
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
