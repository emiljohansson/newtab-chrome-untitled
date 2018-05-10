import test from 'ava'
import HistoryNodes from 'core/HistoryNodes'
import getAllTextNodes from 'core/getAllTextNodes'

test('should find all text nodes, matchin a key, and convert them to a HistoryNode', t => {
  const el = document.createElement('div')
  el.innerHTML = `{{foo}}<br/>{{foo}} Bar`
  const nodes = getAllTextNodes(el)
  const historyNodes = HistoryNodes('foo', nodes)
  t.pass()
  t.deepEqual(historyNodes, [{
    node: nodes[0],
    orgContent: `{{foo}}`
  }, {
    node: nodes[1],
    orgContent: `{{foo}} Bar`
  }])
})
