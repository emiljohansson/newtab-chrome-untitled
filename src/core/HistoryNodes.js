import { filter, map } from 'lodash'
import HistoryNode from './HistoryNode.js'

export default (key, textNodes) => map(
  filter(textNodes, node =>
    node.textContent
      .replace(/ /g, '')
      .indexOf(`{{${key}}}`) > -1
  ),
  HistoryNode
)
