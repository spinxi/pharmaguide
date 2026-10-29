import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import CheckoutView from '../views/CheckoutView.vue'
import CheckoutSuccessView from '../views/CheckoutSuccessView.vue'
import AccountView from '../views/AccountView.vue'
import BranchTerminalView from '../views/BranchTerminalView.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/category/:slug',
      name: 'category',
      component: CategoryView,
      props: true,
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      props: true,
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/order-success',
      alias: '/checkout/success',
      name: 'order-success',
      component: CheckoutSuccessView,
    },
    {
      path: '/account',
      name: 'account',
      component: AccountView,
    },
    {
      path: '/branch-terminal',
      name: 'branch-terminal',
      component: BranchTerminalView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
