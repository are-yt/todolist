import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App, {
  author: 'cy',
  createAt: '2022-09-15',
  desc: 'utools.plugin.专注todo',
  email: '2821458718@qq.com'
})
app.mount(document.getElementById('app') as HTMLElement)
