import { filter } from 'lodash'

const textTag = '[object Text]'

const getAllTextNodes = el => {
  const childNodes = el.childNodes
  let shadowNodes = []
  if (el.shadowRoot != null) {
    shadowNodes = [...el.shadowRoot.childNodes]
  }
  let nodes = filter([
    ...childNodes,
    ...shadowNodes
  ], node => node.toString() === textTag)
  nodes = nodesFromChildren(nodes, el.children)
  if (el.shadowRoot != null) {
    nodes = nodesFromChildren(nodes, el.shadowRoot.children)
  }
  return nodes
}

const nodesFromChildren = (nodes, children) => {
  let index = children.length
  while (index--) {
    nodes = nodes.concat(getAllTextNodes(children[index]))
  }
  return nodes
}

export default getAllTextNodes
