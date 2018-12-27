import Store from '../../src/store/Store'

test('should update state from actions and mutations', () => {
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

    public incrementIfEven (): void {
      if (this.state % 2 === 0) {
        this.increment()
      }
    }
  }

  const store: CounterStore<number> = new CounterStore(0)
  let expected: number[] = [
    1, 2, 1, 2, 3
  ]
  let index: number = 0
  expect.assertions(expected.length)
  store.subscribe((state: number) => {
    expect(state).toBe(expected[index])
    index++
  })
  store.increment()
  store.increment()
  store.decrement()
  store.incrementIfEven()
  store.increment()
  store.incrementIfEven()
})
