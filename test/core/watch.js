import test from 'ava'
import sinon from 'sinon'
import { uniqueId } from 'lodash'
import watch from 'core/watch'

test('should create a Subject', t => {
  const vm = {
    $id: uniqueId('abc_')
  }
  const expected = 123
  const subject = watch(vm, 'foo')
  subject.subscribe(value => {
    t.is(value, expected)
  })
  subject.next(expected)
})

test('should return the same Subject for matching key', t => {
  t.plan(2)
  const vm = {
    $id: uniqueId('abc_')
  }
  const expected = 123
  const subject1 = watch(vm, 'foo')
  const subject2 = watch(vm, 'foo')
  subject1.subscribe(value => {
    t.is(value, expected)
  })
  subject2.subscribe(value => {
    t.is(value, expected)
  })
  subject2.next(expected)
})

test('should be based on vm instance', t => {
  t.plan(1)
  const vm1 = {
    $id: uniqueId('abc_')
  }
  const vm2 = {
    $id: uniqueId('abc_')
  }
  const expected = 123
  const subject1 = watch(vm1, 'foo')
  const subject2 = watch(vm2, 'foo')
  subject1.subscribe(value => {
    t.is(value, expected)
  })
  subject2.subscribe(value => {
    t.is(value, expected)
  })
  subject2.next(expected)
})

test('should allow passing in id', t => {
  t.plan(1)
  const id = uniqueId('abc_')
  const expected = 123
  const subject = watch(id, 'foo')
  subject.subscribe(value => {
    t.is(value, expected)
  })
  subject.next(expected)
})
