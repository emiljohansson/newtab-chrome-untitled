export default (el: HTMLElement, type: string) => {
  const evObj: Event = document.createEvent('Events')
  evObj.initEvent(type, true, false)
  el.dispatchEvent(evObj)
}
