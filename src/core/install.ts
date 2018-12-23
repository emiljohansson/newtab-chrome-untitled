import apps from './apps'

export default (id: string, definition: any): any => {
  return apps(id, definition)
}
