import browserEnv from 'browser-env'
browserEnv(['window', 'document', 'navigator'])

// window.Element.prototype.attachShadow = function () {
//   var iframe = this.ownerDocument.createElement('iframe')
//   this.shadowRoot = new ShadowContent(this.appendChild(iframe), {
//     mode: 'open'
//   })
//   return this.shadowRoot
// }
//
// // copyright @WebReflection (https://github.com/WebReflection/attachshadow)
// // Modified April 29 - 2018
// function ShadowContent (iframe, options) {
//   var descriptors = {mode: {value: options.mode}}
//   // var document = iframe.contentDocument
//   // var window = iframe.contentWindow
//   // var Observer = window.MutationObserver || SMObserver
//   // in some browser there's no synchronous body when you create an iframe
//   var body = document.body || document.createElement('body')
//   var fragment = document.createDocumentFragment()
//
//   // the returned body might be the right one or not
//   // same goes for its document, it might be replaced
//   // once the iframe.onload is triggered (if ever)
//   // these functions pass through scoped vars to accessors
//   // ensuring the right target is always reached.
//   var viaBody = function () { return body }
//
//   // attach all delegates to the shadowRoot element
//   for (var key in fragment) {
//     if (typeof fragment[key] === 'function' && key in body) {
//       descriptors[key] = {value: body[key].bind(body)}
//     } else {
//       switch (key) {
//         case 'nodeName':
//         case 'nodeType':
//         case 'tagName':
//           descriptors[key] = indirectAccessor(
//             function () { return fragment },
//             key
//           )
//           break
//         case 'activeElement':
//           descriptors[key] = indirectAccessor(
//             function () { return document },
//             key
//           )
//           break
//         default:
//           descriptors[key] = indirectAccessor(viaBody, key)
//           break
//       }
//     }
//   }
//
//   // including innerHTML and textContent
//   descriptors.innerHTML = indirectAccessor(viaBody, 'innerHTML')
//   descriptors.textContent = indirectAccessor(viaBody, 'textContent')
//
//   // attaching all delegates to the returned instance
//   Object.defineProperties(this, descriptors)
//
//   // attach to the iframe some information used on onload
//   // var id = uniqueId()
//   // var listeners = []
//   // var Element = (window.Element || window.Node).prototype
//   // var addEventListener = Element[ADD_EVENT_LISTENER]
//   // var removeEventListener = Element[REMOVE_EVENT_LISTENER]
//   // function iframeSetup () {
//   //   var html = document.documentElement
//   //   Element.attachShadow = element.attachShadow
//   //   // Element[ADD_EVENT_LISTENER] = function (type, listener, options) {
//   //   //   var self = this
//   //   //   var listeners = self[id] || (self[id] = {s: [], d: []})
//   //   //   var i = listeners.s.indexOf(listener)
//   //   //   if (i < 0) {
//   //   //     i = listeners.s.push(listener) - 1
//   //   //     listeners.d[i] = function (event) {
//   //   //       if (!self.contains(event.target)) return
//   //   //       var e = iframe.ownerDocument.createEvent('Event')
//   //   //       e.initEvent(event.type, event.bubbles, event.cancelable)
//   //   //       for(var k in event) { try { e[k] = event[k] } catch(meh) {} }
//   //   //       iframe.parentNode[DISPATCH_EVENT](e)
//   //   //     }
//   //   //     addEventListener.call(self, type, listener, options)
//   //   //     addEventListener.call(html, type, listeners.d[i], options)
//   //   //   }
//   //   // }
//   //   // Element[REMOVE_EVENT_LISTENER] = function (type, listener, options) {
//   //   //   var listeners = this[id]
//   //   //   var i = listeners ? listeners.s.indexOf(listener) : -1
//   //   //   if (i > -1) {
//   //   //     removeEventListener.call(this, type, listener, options)
//   //   //     removeEventListener.call(html, type, listeners.d[i], options)
//   //   //     listeners.s.splice(i, 1)
//   //   //     listeners.d.splice(i, 1)
//   //   //   }
//   //   // }
//   //   // all listeners registered while the iframe state was incomplete
//   //   // should now be attached with the right method to those nodes
//   //   for (var tmp, i = 0; i < listeners.length; i++) {
//   //     tmp = listeners[i]
//   //     Element[tmp[0]].apply(tmp[1], tmp[2])
//   //   }
//   // }
//
//   // if the document is not ready, set it up onload
//   // if (document.readyState != 'complete') {
//   //   iframe.onload = onload
//   //   // also intercept every addEventListener happened before
//   //   Element[ADD_EVENT_LISTENER] = function () {
//   //     listeners.push([ADD_EVENT_LISTENER, this, arguments])
//   //   }
//   //   Element[REMOVE_EVENT_LISTENER] = function () {
//   //     listeners.push([REMOVE_EVENT_LISTENER, this, arguments])
//   //   }
//   //   Element[DISPATCH_EVENT] = function () {
//   //     listeners.push([DISPATCH_EVENT, this, arguments])
//   //   }
//   // }
//   // // otherwise set it up right away
//   // else onload()
//
//   // attached to the iframe onload and also forced as setTimeout
//   // function onload() {
//   //   document = iframe.contentDocument
//   //   var head = headOf(document)
//   //   // Shadow DOM simulated styles
//   //   head.appendChild(
//   //     document.createElement('style')
//   //   ).textContent = 'html,body{' + cssReset + '}*{margin:0}' + shadowReset
//   //   // JavaScript Shadow DOM fake environment bootstrap
//   //   iframeSetup()
//   //   // the previously returned node most likely is full of content
//   //   var firstChild
//   //   // which in case is different from the document one
//   //   if (body !== document.body) {
//   //     // is going to be re-appended to the live iframe body
//   //     while (firstChild = body.firstChild)
//   //       document.body.appendChild(firstChild)
//   //     // ensure the body reference points at the right body
//   //     body = document.body
//   //   }
//   //   // every change inside the iframe should re-calculate width and height
//   //   var callback = mutationCallback.bind(
//   //     {width: 0, height: 0},
//   //     iframe.style,
//   //     body,
//   //     styleChecks.bind(body.getElementsByTagName('style'))
//   //   )
//   //   // the MutationObserver or its fallback is in charge of this
//   //   new Observer(callback).observe(body, {
//   //     childList: true,
//   //     attributes: true,
//   //     subtree: true
//   //   })
//   //   // but regardless, first ready document should calculate its size
//   //   callback()
//   // }
//
//   function indirectAccessor (context, key) {
//     return {
//       get: function () { return context()[key] },
//       set: function (value) { context()[key] = value }
//     }
//   }
// }
