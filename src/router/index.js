// import VueRouter from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/index',
    name: 'index',
    component: () => import('../login/index.vue'),
	children:[{
	    	path:'list',
	    	name:'list',
	    	component:()=>import('../components/404.vue')
	    }]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../components/404.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/hello.vue')
  },
  {
    path: '/', // 重定向
    redirect: (_) => {
      return { path: '/index' }
    },
  },
  {
    path: '/:currentPath(.*)*', // 路由未匹配到，进入这个
    redirect: (_) => {
      return { path: '/404' }
    },
  },
]
// Vue-router新版本中，需要使用createRouter来创建路由
export default createRouter({
  // 指定路由的模式,此处使用的是web模式
  history: createWebHistory(),
  routes // short for `routes: routes`
})
