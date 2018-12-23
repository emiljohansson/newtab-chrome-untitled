import { forEach } from 'lodash'
import { InstanceOptions } from './Instance'

export const decoratorOptions: any = (proto: any = {}): InstanceOptions => {
  const options: InstanceOptions = {
    data: proto.data || {},
    styles: proto.styles || {},
    template: proto.template || ``
  }
  return options
}

export function Component (options?: InstanceOptions): any {
  return function (Component: any): void {
    forEach(options, (value: any, key: string) => {
      Component.prototype[key] = value
    })
    return Component
  }
}
