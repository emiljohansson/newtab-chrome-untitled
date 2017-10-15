import { filter } from 'lodash'

const textTag = '[object Text]'

const getAllTextNodes = el => {
  let nodes = filter(el.childNodes, node => node.toString() === textTag)
  const children = el.children
  let index = children.length
  while (index--) {
    nodes = nodes.concat(getAllTextNodes(children[index]))
  }
  return nodes
}

export default getAllTextNodes
