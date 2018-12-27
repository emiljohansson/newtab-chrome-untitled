import attachStyleSheet from '../../src/core/styleSheet'

const attachStyle = styles => {
  const el: HTMLElement = document.createElement('div')
  attachStyleSheet(styles, el)
  if (el.firstChild === null) {
    return null
  }
  return (el.firstChild as Element).innerHTML
}

test('attach: should attach a style element', () => {
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
  expect(content).toBe(expected)
})

test('classes: should kebab case properties', () => {
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
  expect(content).toBe(expected)
})

test('classes: should add pseudo', () => {
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
  expect(content).toBe(expected)
})

test('classes: should replace & with current scope', () => {
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
  expect(content).toBe(expected)
})

test('classes: should extend style', () => {
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
  expect(content).toBe(expected)
})

test('classes: should not replace tag name selectors', () => {
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
  expect(content).toBe(expected)
})
