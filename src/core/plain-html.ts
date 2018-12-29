import watch from './watch'
import { Subject } from './Subject'

// const betweenTagsRegExp: RegExp = /<(.|\n)*?>/g
const startTagRegExp: RegExp = /<\s*\w.*?>/g
const endTagRegExp: RegExp = /<\s*\/\s*\w\s*.*?>|<\s*br\s*>/g

const createResult: any = (template: string[], keys: string[], props: any): any => {
  template = template.map((str: string) => str.replace(/\r?\n|\r/g, ''))
  // template = template.map((str: string) => str.replace(/\r?\n|\r/g, ''))
  const pieces: any[] = [template[0]]
  const texts: Text[] = []
  keys.forEach((key: string, index: number) => {
    const value: any = props[key]
    const node: Text = document.createTextNode(value)
    pieces.push(node, template[index + 1])
    texts[index + 1] = node

    const update: any = (value: any): void => {
      node.textContent = value
    }
    const subject: Subject<any> = watch(props, key)
    subject.subscribe(update)
  })

  // let matches: string[] = pieces[0].match(startTagRegExp)
  // if (matches) {
  //   const st: string = matches[0]
  //   pieces[0] = pieces[0].replace(st, '')
  //   pieces.unshift(st)
  // }
  // const l: number = pieces.length - 1
  // matches = pieces[l].match(endTagRegExp)
  // if (matches) {
  //   const en: string = matches[0]
  //   pieces[l] = pieces[l].replace(en, '')
  //   pieces.push(en)
  // }
  // pieces.forEach((piece: any) => {
  //   if (piece.match && (piece.match(startTagRegExp))) {
  //     // && piece.match(endTagRegExp)
  //     console.log(piece, piece.match(betweenTagsRegExp))
  //   }
  // })
  return {
    pieces: createPieces(pieces),
    texts
  }
}

const createPieces: any = (pieces: any[]): any => {
  if (pieces[0].match(startTagRegExp) && pieces[0].match(endTagRegExp)) {
    return pieces
  }
  let matches: string[] = pieces[0].match(startTagRegExp)
  if (matches) {
    const newPieces: any = {}
    const st: string = matches[0]
    pieces[0] = pieces[0].replace(st, '')
    newPieces.start = st

    const l: number = pieces.length - 1
    matches = pieces[l].match(endTagRegExp)
    if (matches) {
      const en: string = matches[0]
      pieces[l] = pieces[l].replace(en, '')
      newPieces.end = en
    }
    // matches = pieces[0].match(startTagRegExp)
    // console.log(matches)

    newPieces.pieces = createPieces(pieces)

    return newPieces
  }

  return pieces
}

export const html: any = (template: string[], ...keys: string[]): (props: any) => string =>
  (props: any): any => {
    return createResult(template, keys, props)
  }

export function render (template: any, el?: HTMLElement): void {
  if (!el) {
    return
  }
  const pieces: any = template.pieces
  let container: Element = el

  if (pieces.start) {
    renderPieces(el, pieces)
    return
  }

  if (pieces[0].match(startTagRegExp)) {
    const firstLevel: any[] = [
      pieces.splice(0, 1),
      pieces.splice(-1)
    ]
    el.innerHTML = firstLevel.join('')
    container = el.firstElementChild as Element
  }
  pieces.forEach(appendTextNode(container))
}

const renderPieces: any = (el: HTMLElement, pieces: any): void => {
  el.innerHTML = `${pieces.start}${pieces.end}`
  const container: Element = el.firstElementChild || el
  if (Array.isArray(pieces.pieces)) {
    pieces.pieces.forEach(appendTextNode(container))
    return
  }
  renderPieces(container, pieces.pieces)
}

const appendTextNode: any = (container: Element): any =>
  (text: any) => {
    const node: Text = typeof text === 'string'
      ? document.createTextNode(text)
      : text
    container.appendChild(node)
  }
