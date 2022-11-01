self.onmessage = () => {
  setInterval(() => {
    self.postMessage('ok')
  }, 1000 * 30)
}
export default {}
