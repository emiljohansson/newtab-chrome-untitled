import { filter } from 'lodash'

//
//
// TODO assign correct types
//
//

const textTag: string = '[object Text]'

const getAllTextNodes = (el: any): any => {
  const childNodes: any = getChildNodes(el)
  let nodes: any = filter(childNodes, node => node.toString() === textTag)
  nodes = nodesFromChildren(nodes, el.children)
  if (el.shadowRoot != null) {
    nodes = nodesFromChildren(nodes, el.shadowRoot.children)
  }
  return nodes
}

const getChildNodes = (el: any): any => {
  let shadowNodes: any = el.shadowRoot != null
    ? el.shadowRoot.childNodes
    : []
  return [
    ...el.childNodes,
    ...shadowNodes
  ]
}

const nodesFromChildren = (nodes: any, children: any): any => {
  let index = children.length
  while (index--) {
    nodes = nodes.concat(getAllTextNodes(children[index]))
  }
  return nodes
}

export default getAllTextNodes
