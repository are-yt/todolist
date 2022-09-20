import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/main/Main.vue')
  },
  {
    path: '/statistics',
    component: () => import('../views/statistics/Statistics.vue')
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})

export default router
