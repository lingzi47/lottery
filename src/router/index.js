import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import choujiang from '../views/choujiang.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'choujiang',
    component: choujiang,
  },

  {
    path: '/home',
    name: 'Home',
    component: Home,
  },


]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})




export default router
