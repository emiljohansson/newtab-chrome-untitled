import { filter } from 'lodash'
import getAllTextNodes from 'core/getAllTextNodes'

export const contentSelector = '{{o-content}}'

export default (vm, htmlContent) => {
  if (vm.$el == null) {
    return
  }
  const node = filter(
    getAllTextNodes(vm.$el),
    node => node.textContent
      .replace(/ /g, '')
      .trim()
      .indexOf(contentSelector) > -1
  )[0]
  if (node == null) {
    return
  }
  if (htmlContent == null) {
    node.textContent = ''
    return
  }
  const newNode = document.createElement('div')
  newNode.innerHTML = htmlContent
  node.parentNode.insertBefore(newNode.children[0], node)
  node.parentNode.removeChild(node)
}
