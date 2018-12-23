import * as sinon from 'sinon'
import { Subject } from '../../src/core/Subject'

test('next should trigger subscribers', () => {
  const callback: any = sinon.spy()
  const subject: Subject<void> = new Subject<void>()
  subject.subscribe(callback)
  subject.subscribe(callback)
  subject.next()
  expect(callback.callCount).toBe(2)
  expect(subject.numberOfSubscriptions).toBe(2)
})

test('complete should stop trigger subscribers', () => {
  const callback: any = sinon.spy()
  const subject: Subject<void> = new Subject<void>()
  subject.subscribe(callback)
  subject.complete()
  subject.next()
  expect(callback.called).toBeFalsy()
  subject.subscribe(callback)
  subject.next()
  expect(callback.called).toBeFalsy()
})

test('next should pass parameters to subscribers', (done: any) => {
  const expected: number = 123
  const callback: any = (value: number): void => {
    expect(value).toBe(expected)
    done()
  }
  const subject: Subject<number> = new Subject()
  subject.subscribe(callback)
  subject.next(expected)
})

test('unsubscribe should remove subscription', () => {
  const callback1: any = sinon.spy()
  const callback2: any = sinon.spy()
  const subject: Subject<void> = new Subject()
  const unsubscribe: any = subject.subscribe(callback1)
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
