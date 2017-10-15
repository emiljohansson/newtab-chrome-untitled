export default (el, type) => {
  if (el.fireEvent) {
    el.fireEvent('on' + type)
  } else {
    const evObj = document.createEvent('Events')
    evObj.initEvent(type, true, false)
    el.dispatchEvent(evObj)
  }
}
