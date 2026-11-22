
import { createRouter, createWebHashHistory } from 'vue-router'
import AboutView from '@/views/AboutView.vue'
import HomeView from '@/views/HomeView.vue'
import CurrencyView from '@/views/CurrencyView.vue'
import DestinationView from '@/views/DestinationView.vue'

const routes = [
  {
    path: '/',
    alias: '/inicio',
    name: 'home',
    component: HomeView,
    meta: { title: 'Início' },
  },
  {
    path: '/sobre',
    name: 'about',
    component: AboutView,
    meta: { title: 'Sobre Nós' },
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
  {
  path: '/destino/:id',
  name: 'destination',
  component: DestinationView,
  meta: { title: 'Detalhes do Destino' },
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
