import { createApp } from 'vue'
// import Antd from 'ant-design-vue';
import App from './App.vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import '@/assets/scss/element.scss'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router  from '/src/router/index.js'
// import 'ant-design-vue/dist/reset.css';
const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(router).use(pinia).mount('#app');
