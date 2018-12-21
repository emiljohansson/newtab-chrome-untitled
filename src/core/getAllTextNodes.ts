import { filter } from 'lodash'

const textTag = '[object Text]'

const getAllTextNodes = el => {
  const childNodes = getChildNodes(el)
  let nodes = filter(childNodes, node => node.toString() === textTag)
  nodes = nodesFromChildren(nodes, el.children)
  if (el.shadowRoot != null) {
    nodes = nodesFromChildren(nodes, el.shadowRoot.children)
  }
  return nodes
}

const getChildNodes = el => {
  let shadowNodes = el.shadowRoot != null
    ? el.shadowRoot.childNodes
    : []
  return [
    ...el.childNodes,
    ...shadowNodes
  ]
}

const nodesFromChildren = (nodes, children: HTMLElement[]) => {
  let index = children.length
  while (index--) {
    nodes = nodes.concat(getAllTextNodes(children[index]))
  }
  return nodes
}

export default getAllTextNodes
