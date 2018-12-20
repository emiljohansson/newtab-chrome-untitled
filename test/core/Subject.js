import sinon from 'sinon'
import Subject from '../../src/core/Subject'

test('next should trigger subscribers', () => {
  const callback = sinon.spy()
  const subject = Subject()
  subject.subscribe(callback)
  subject.subscribe(callback)
  subject.next()
  expect(callback.callCount).toBe(2)
  expect(subject.numberOfSubscriptions).toBe(2)
})

test('complete should stop trigger subscribers', () => {
  const callback = sinon.spy()
  const subject = Subject()
  subject.subscribe(callback)
  subject.complete()
  subject.next()
  expect(callback.called).toBeFalsy()
  subject.subscribe(callback)
  subject.next()
  expect(callback.called).toBeFalsy()
})

test('next should pass parameters to subscribers', (done) => {
  const expected = 123
  const callback = value => {
    expect(value).toBe(expected)
    done()
  }
  const subject = Subject()
  subject.subscribe(callback)
  subject.next(expected)
})

test('unsubscribe should remove subscription', () => {
  const callback1 = sinon.spy()
  const callback2 = sinon.spy()
  const subject = Subject()
  const unsubscribe = subject.subscribe(callback1)
  subject.subscribe(callback2)
  subject.next()
  expect(callback1.callCount).toBe(1)
  expect(subject.numberOfSubscriptions).toBe(2)
  unsubscribe()
  subject.next()
  expect(callback1.callCount).toBe(1)
  expect(callback2.callCount).toBe(2)
  expect(subject.numberOfSubscriptions).toBe(1)
})
