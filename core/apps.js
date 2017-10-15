const apps = {}

export default (id, definition) => {
  if (definition == null) {
    return apps[id]
  }
  apps[id] = definition
}
