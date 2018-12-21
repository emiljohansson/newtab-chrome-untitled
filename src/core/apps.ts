const apps: any = {}

export default (id: string, definition?: any): any => {
  if (definition === undefined) {
    return apps[id]
  }
  apps[id] = definition
  return apps[id]
}
