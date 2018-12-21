const apps: any = {}

export default (id: string, definition?: any): void => {
  if (definition === undefined) {
    return apps[id]
  }
  apps[id] = definition
}
