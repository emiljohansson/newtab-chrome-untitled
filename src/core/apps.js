const apps = {}

export default (id, definition) => {
  if (definition == null) {
    if (id == null) {
      return apps['BaseApp']
    }
    return apps[id]
  }
  apps[id] = definition
}
