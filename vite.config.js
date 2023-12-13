import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import '@/styles/main.scss';`
      },
	  less: {
	    additionalData: `@import '@/styles/main.less';`
	  }
    }
  }
});

