export default (string, value, key) =>
  string
    .replace(/\s+(?=[^{\]]*\})/g, '')
    .split(`{{${key}}}`)
    .join(value)
