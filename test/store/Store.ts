import Store from '../../src/store/Store'

test('should update state from actions and mutations', () => {
  expect.assertions(3)
  class CounterStore<T = number> extends Store<number> {
    public increment (): void {
      this.mutate((state: number): number => {
        return state + 1
      })
    }

    public decrement (): void {
      this.mutate((state: number): number => {
        return state - 1
      })
    }
  }

  const store: CounterStore<number> = new CounterStore(0)
  let expected: number[] = [
    1, 2, 1
  ]
  let index: number = 0
  store.subscribe((state: number) => {
    expect(state).toBe(expected[index])
    index++
  })
  store.increment()
  store.increment()
  store.decrement()
})
