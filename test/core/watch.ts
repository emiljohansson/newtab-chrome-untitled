import { uniqueId } from 'lodash'
import watch from '../../src/core/watch'
import { Subject } from '../../src/core/Subject'

test('should create a Subject', () => {
  expect.assertions(1)
  const vm = {
    $id: uniqueId('abc_')
  }
  const expected: number = 123
  const subject: Subject<number> = watch(vm, 'foo')
  subject.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject.next(expected)
})

test('should return the same Subject for matching key', () => {
  expect.assertions(2)
  const vm = {
    $id: uniqueId('abc_')
  }
  const expected: number = 123
  const subject1: Subject<number> = watch(vm, 'foo')
  const subject2: Subject<number> = watch(vm, 'foo')
  subject1.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject2.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject2.next(expected)
})

test('should be based on vm instance', () => {
  expect.assertions(1)
  const vm1 = {
    $id: uniqueId('abc_')
  }
  const vm2 = {
    $id: uniqueId('abc_')
  }
  const expected: number = 123
  const subject1: Subject<number> = watch(vm1, 'foo')
  const subject2: Subject<number> = watch(vm2, 'foo')
  subject1.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject2.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject2.next(expected)
})

test('should allow passing in id', () => {
  expect.assertions(1)
  const id: string = uniqueId('abc_')
  const expected: number = 123
  const subject: Subject<number> = watch(id, 'foo')
  subject.subscribe(value => {
    expect(value).toBe(expected)
  })
  subject.next(expected)
})
