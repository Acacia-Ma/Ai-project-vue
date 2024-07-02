import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router  from '/src/router/index.js'
import {useTestStore} from '@/store/user' // 确保正确导入user
import NProgress from 'nprogress' // 引入nprogress插件
import { refreshByToken } from '@/api/user' // 导入刷新token的接口
import "nprogress/nprogress.css"; // 导入样式，否则看不到效果

NProgress.configure({ showSpinner: false }); // 显示右上角螺旋加载提示
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


router.beforeEach((to, from, next) => {
    NProgress.start()
    document.title = to.meta.title
    // whiteList 为不需要登录的页面,格式为name，name为路由的name
    let whiteList = ['/index', '/nopermission', '/404']
    // whiteList_root 为需要权限的页面
    let whiteList_root = ['/home/contacts','/manage']
    // 如果在白名单中，直接跳转
    if (whiteList.indexOf(to.path) > -1) {
        next()
        return false
    }
    let login_user = useTestStore()
    // 如果没有登录信息，跳转到登录页面
    if (['',undefined,null].indexOf(login_user.refresh_token) > -1) {
        next({ name: '/' })
        return false
    }
    // 如果不是管理员，跳转到无权限页面
    if (whiteList_root.indexOf(to.path) > -1 && login_user.permission != 100) {
        next({ name: 'nopermission' })
        return false
    }
    // 如果token过期，刷新token
    if ((parseFloat(login_user.now_time) + 0.9 * 60 * 60 * 1000) < parseFloat(new Date().getTime()) || login_user.now_time == 0) {
        // 刷新token
        refreshByToken().then(data => {
            login_user.Refresh_token(data.data).then(() => {
                next()
            })
        }).catch(() => {
            // 刷新失败，跳转到登录页面
            next({ name: 'index' })
        }
        )
    }
    next()
}
)
router.afterEach(() => {
    NProgress.done()
}
)

app.use(router).use(pinia).mount('#app');
