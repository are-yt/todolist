import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { globalCpns } from './plugins'
import router from './router'

const app = createApp(App, {
  developer: 'cy',
  createAt: '2022-09-15',
  desc: 'utools.plugins.专注todo',
  email: '2821458718@qq.com'
})
// 路由
app.use(router)
// Vue_Cli创建的vue3应用需要使用这个插件来初始化pinia
app.use(createPinia())
// 注册全局组件插件
app.use(globalCpns)
app.config.errorHandler = (error, instance, info) => {
  console.log('---errorHandler started')
  console.log(error, instance, info)
  console.log('---errorHandler ended')
}
app.config.warnHandler = (msg, instance, trace) => {
  console.log('---warnHandler started')
  console.log(msg, instance, trace)
  console.log('---warnHandler ended')
}
app.mount(document.getElementById('app') as HTMLElement)
