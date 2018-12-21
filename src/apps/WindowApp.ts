import { installApp } from './OS'

const WindowApp: any = {
  data: {}
}

// tslint:disable-next-line:no-empty
WindowApp.windowBlurred = function () {}

// tslint:disable-next-line:no-empty
WindowApp.windowFocused = function () {}

export default (definition, App) => {
  const AppProto = Object.assign({}, WindowApp, App)
  installApp(definition, AppProto)
  return AppProto
}
