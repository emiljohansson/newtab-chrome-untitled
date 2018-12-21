import HistoryNodes from '../../src/core/HistoryNodes'
import getAllTextNodes from '../../src/core/getAllTextNodes'

test('should find all text nodes, matchin a key, and convert them to a HistoryNode', () => {
  const el = document.createElement('div')
  el.innerHTML = `{{foo}}<br/>{{foo}} Bar`
  const nodes = getAllTextNodes(el)
  const historyNodes = HistoryNodes('foo', nodes)
  expect(historyNodes).toEqual([{
    node: nodes[0],
    orgContent: `{{foo}}`
  }, {
    node: nodes[1],
    orgContent: `{{foo}} Bar`
  }])
})
