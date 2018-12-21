import test from 'ava'
import attachStyleSheet from 'core/styleSheet'

const attachStyle = styles => {
  const el = document.createElement('div')
  attachStyleSheet(styles, el)
  if (el.firstChild == null) {
    return null
  }
  return el.firstChild.innerHTML
}

test('should do nothing if el is null', t => {
  attachStyleSheet({
    blue: {}
  })
  t.pass()
})

test('attach: should attach a style element', t => {
  const expected = `
.blue {
}

.red {
}
`
  const content = attachStyle({
    blue: {},
    red: {}
  })
  t.is(content, expected)
})

test('attach: should NOT attach when empty', t => {
  const content = attachStyle()
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
  const content = attachStyle({
    blue: {
      fontSize: '1rem'
    },
    red: {
      borderColor: 'red',
      height: 0,
      width: '100%'
    }
  })
  t.is(content, expected)
})

test('classes: should add pseudo', t => {
  const expected = `
:host {
font-size: 1rem;
}
`
  const content = attachStyle({
    ':host': {
      fontSize: '1rem'
    }
  })
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
  const content = attachStyle({
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
  const content = attachStyle({
    bar: {
      extend: foo,
      fontSize: '1rem'
    }
  })
  t.is(content, expected)
})

test('classes: should not replace tag name selectors', t => {
  const expected = `
.bar {
display: block;
}
.bar > div {
font-size: 1rem;
}
`
  const foo = {
    display: 'block',

    '& > div': {
      fontSize: '1rem'
    }
  }
  const content = attachStyle({
    bar: {
      extend: foo
    }
  })
  t.is(content, expected)
})
