import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EquipsView from '../views/EquipsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Home Page' }
  },
  {
    path: '/equipments',
    name: 'equipments',
    component: EquipsView,
    meta: { title: 'List of equipments' }
  },
//   {
//     path: '/sobre',
//     name: 'sobre',
//     // Carregamento lazy (só carrega quando acessar)
//     component: () => import('../views/SobreView.vue'),
//     meta: { title: 'Sobre' }
//   },
//   {
//     path: '/:pathMatch(.*)*', // Rota 404 - qualquer URL não encontrada
//     name: 'not-found',
//     component: () => import('../views/NotFoundView.vue')
//   }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router