import { createRouter, createWebHashHistory } from 'vue-router'
import CurrencyView from '@/views/CurrencyView.vue'

/**
 * O componente é publicado no GitHub Pages, onde não é possível reescrever
 * pedidos para o index.html. O histórico por hash garante que qualquer rota
 * continua a funcionar ao actualizar a página.
 */
const routes = [
  {
    path: '/',
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
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title ? `${to.meta.title} · EasyTour` : 'EasyTour · Conversor de Moedas'
  document.title = pageTitle
})

export default router
