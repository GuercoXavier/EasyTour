
import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import CurrencyView from '@/views/CurrencyView.vue'

const routes = [
  {
    path: '/',
    alias: '/inicio',
    name: 'home',
    component: HomeView,
    meta: { title: 'Início' },
  },
  {
    path: '/cambio',
    name: 'currency',
    component: CurrencyView,
    meta: { title: 'Conversor de Moedas' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página não encontrada' },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta?.title || 'EasyTour'} · EasyTour`
})

export default router
