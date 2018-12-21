import { isPlainObject } from 'lodash'

export default (string, value, key: string, objectAsString = '') => {
  if (isPlainObject(value)) {
    const objKey = key.replace(`${objectAsString}.`, '')
    return string
      .replace(/\s+(?=[^{\]]*\})/g, '')
      .split(`{{${key}}}`)
      .join(value[objKey])
  }
  return string
    .replace(/\s+(?=[^{\]]*\})/g, '')
    .split(`{{${key}}}`)
    .join(value)
}
