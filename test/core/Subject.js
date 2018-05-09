import test from 'ava'
import sinon from 'sinon'
import Subject from 'core/Subject'

test('next should trigger subscribers', t => {
  const callback = sinon.spy()
  const subject = Subject()
  subject.subscribe(callback)
  subject.subscribe(callback)
  subject.next()
  t.is(callback.callCount, 2)
  t.is(subject.numberOfSubscriptions, 2)
})

test('complete should stop trigger subscribers', t => {
  const callback = sinon.spy()
  const subject = Subject()
  subject.subscribe(callback)
  subject.complete()
  subject.next()
  t.false(callback.called)
  subject.subscribe(callback)
  subject.next()
  t.false(callback.called)
})

test('next should pass parameters to subscribers', t => {
  const expected = 123
  const callback = value => {
    t.is(value, expected)
  }
  const subject = Subject()
  subject.subscribe(callback)
  subject.next(expected)
})
