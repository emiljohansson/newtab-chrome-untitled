import test from 'ava'
import StyleSheet from 'stylesheet'

test('should create a style sheet', t => {
  const expected = {'red': 'red-0-1', 'blue': 'blue-0-2'}
  const styleSheet = StyleSheet({
    red: {},
    blue: {}
  })
  t.deepEqual(styleSheet.classes, expected)
})
