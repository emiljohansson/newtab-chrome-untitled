import { isPlainObject } from 'lodash'

export default (text, value, key: string, objectAsString = '') => {
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
