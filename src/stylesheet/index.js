import { create } from 'jss'
import preset from 'jss-preset-default'

export default (styles = {}) => {
  const jss = create()
  jss.setup(preset())
  return jss.createStyleSheet(styles)
}
