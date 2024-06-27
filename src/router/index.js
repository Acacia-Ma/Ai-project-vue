// import VueRouter from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    path: '/index',
    name: 'index',
    meta : { title: '登录' },
    component: () => import('@views/login/index.vue'),
	children:[{
	    	path:'list',
	    	name:'list',
	    	component:()=>import('@components/404.vue')
	    }]
  },
  {
    path: '/404',
    name: '404',
    meta : { title: '404' },
    component: () => import('@components/404.vue')
  },
  {
    path: '/nopermission',
    name: 'nopermission',
    meta : { title: '无权限' },
    component: () => import('@components/nopermission.vue')
  },
  {
    path: '/home',
    name: 'home',
    meta : { title: '首页' },
    component: () => import('@views/home/HomeView.vue'),
    children: [
      {
        path: "Chat",
        name: 'Chat',
        meta : { title: 'AI聊天' },
        component: () => import('@/views/home/components/Chat.vue') // 确保路径正确
      },
      {
        path: 'translation',
        name: 'MachineTranslation',
        meta : { title: '机器翻译' },
        component: () => import('@/views/home/components/MachineTranslation.vue') // 确保路径正确
      },
      {
        path: 'recognition',
        name: 'ImageRecognition',
        meta : { title: '图片识别' },
        component: () => import('@/views/home/components/ImageRecognition.vue') // 确保路径正确
      },
      {
        path: 'evaluation',
        name: 'Speechevaluation',
        meta : { title: '语音评测' },
        component: () => import('@/views/home/components/Speechevaluation.vue') // 确保路径正确
      },
      {
        path:'contacts',
        name:'Contacts',
        meta : { title: '通讯录' },
        component:()=>import('@/views/home/components/Contacts.vue')
      },
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    meta : { title: '管理' },
    component: () => import('@/views/home/components/ManageView.vue'),
  },
  {
    path: '/correction',
    name: 'HomeworkCorrection',
    component: () => import('@/views/home/components/HomeworkCorrection.vue') // 确保路径正确
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


