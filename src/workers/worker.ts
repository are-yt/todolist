self.onmessage = () => {
  // setInterval(() => {
  //   self.postMessage(e.data, '1')
  // }, 1000)
  setInterval(() => {
    self.postMessage('ok')
  }, 1000)
}
export default {}
