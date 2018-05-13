import { filter, map } from 'lodash-es'
import HistoryNode from 'core/HistoryNode'

export default (key, textNodes) => map(
  filter(textNodes, node =>
    node.textContent
      .replace(/ /g, '')
      .indexOf(`{{${key}}}`) > -1
  ),
  HistoryNode
)
