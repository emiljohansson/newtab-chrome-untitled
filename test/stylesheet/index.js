import test from 'ava'
import * as styleSheet from 'stylesheet'

test('should create a style sheet', t => {
  const expected = {
    red: {
      backgroundColor: 'red'
    },
    blue: {
      backgroundColor: 'blue'
    }
  }
  const styles = styleSheet.create({
    red: {
      backgroundColor: 'red'
    },
    blue: {
      backgroundColor: 'blue'
    }
  })
  t.deepEqual(styles, expected)
})
