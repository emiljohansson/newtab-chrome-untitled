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

test('unsubscribe should remove subscription', t => {
  const callback1 = sinon.spy()
  const callback2 = sinon.spy()
  const subject = Subject()
  const unsubscribe = subject.subscribe(callback1)
  subject.subscribe(callback2)
  subject.next()
  t.is(callback1.callCount, 1)
  t.is(subject.numberOfSubscriptions, 2)
  unsubscribe()
  subject.next()
  t.is(callback1.callCount, 1)
  t.is(callback2.callCount, 2)
  t.is(subject.numberOfSubscriptions, 1)
})
