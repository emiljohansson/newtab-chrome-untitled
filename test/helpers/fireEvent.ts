export default (el, type) => {
  const evObj = document.createEvent('Events')
  evObj.initEvent(type, true, false)
  el.dispatchEvent(evObj)
}
