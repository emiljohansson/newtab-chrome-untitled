export function Component (options?: any): any {
  return function (Component: any): void {
    Object.keys(options).forEach((key: string) => {
      Component.prototype[key] = options[key]
    })
    return Component
  }
}
