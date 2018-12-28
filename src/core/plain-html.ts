export const html: any = (template: string, ...keys: string[]): (props: any) => string =>
  (props: any): string => {
    const result: string[] = [template[0]]
    keys.forEach((key: string, index: number) => {
      const value: any = props[key]
      result.push(value, template[index + 1])
    })
    return result.join('')
  }

export const render: any = (templateOrFn: () => string, el: HTMLElement): void => {
  el.innerHTML = typeof templateOrFn === 'function'
    ? templateOrFn()
    : templateOrFn
}
