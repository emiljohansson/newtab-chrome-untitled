import { isPlainObject } from 'lodash'

export default (text: string, value: any, key: string, objectAsString: string = ''): string => {
  if (isPlainObject(value)) {
    const objKey = key.replace(`${objectAsString}.`, '')
    return text
      .replace(/\s+(?=[^{\]]*\})/g, '')
      .split(`{{${key}}}`)
      .join(value[objKey])
  }
  return text
    .replace(/\s+(?=[^{\]]*\})/g, '')
    .split(`{{${key}}}`)
    .join(value)
}
