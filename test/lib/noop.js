import test from 'ava'
import noop from 'lib/noop'

test('should do no-operations', t => {
  t.is(noop(), undefined)
})
