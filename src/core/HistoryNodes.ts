import { filter, map, toString } from 'lodash'
import HistoryNode from './HistoryNode'

export default (key: string, textNodes: Node[]): any[] => map(
  filter(textNodes, (node: Node) =>
    toString(node.textContent)
      .replace(/ /g, '')
      .indexOf(`{{${key}}}`) > -1
  ),
  HistoryNode
)
