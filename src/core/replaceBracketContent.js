import { isPlainObject } from 'lodash-es'

export default (string, value, key, objectAsString = '') => {
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
