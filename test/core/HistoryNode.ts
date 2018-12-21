import HistoryNode from '../../src/core/HistoryNode'

test('should create a new object, saving original textContent', () => {
  const el = document.createElement('div')
  el.innerHTML = `Foo`
  const node = el.childNodes[0]
  const historyNode = HistoryNode(node)
  expect(historyNode).toEqual({
    node,
    orgContent: `Foo`
  })
})
