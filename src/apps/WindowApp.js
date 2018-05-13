import { installApp } from './OS.js'

const WindowApp = {
  data: {}
}

WindowApp.windowBlurred = function () {}

WindowApp.windowFocused = function () {}

export default (definition, App) => {
  const AppProto = Object.assign({}, WindowApp, App)
  installApp(definition, AppProto)
  return AppProto
}
