import { filter, map } from '../../node_modules/lodash-es/lodash.js'
import HistoryNode from './HistoryNode.js'

export default (key, textNodes) => map(
  filter(textNodes, node =>
    node.textContent
      .replace(/ /g, '')
      .indexOf(`{{${key}}}`) > -1
  ),
  HistoryNode
)
