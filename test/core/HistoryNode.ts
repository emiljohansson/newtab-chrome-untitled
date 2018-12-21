import test from 'ava'
import HistoryNode from 'core/HistoryNode'

test('should create a new object, saving original textContent', t => {
  const el = document.createElement('div')
  el.innerHTML = `Foo`
  const node = el.childNodes[0]
  const historyNode = HistoryNode(node)
  t.deepEqual(historyNode, {
    node,
    orgContent: `Foo`
  })
})
