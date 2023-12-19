import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 导入对应包
// import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // 环境变量
  const env = loadEnv(mode, process.cwd())
  // 生产环境判断
  const isEnvProduction = mode === 'production'
  return {
    plugins: [vue({
      script: {
        defineModel: true,
      }
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      resolvers: [ElementPlusResolver({
        importStyle: 'sass',
      })],
    }),

    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),

    // viteCompression({
    //   //生成压缩包gz
    //   verbose: true,
    //   disable: false,
    //   threshold: 10240,
    //   algorithm: 'gzip',
    //   ext: '.gz',
    // }),
    ],
    define: {
      'process.env': {}
    },
    base: '/',
    server: {//本地服务
      host: '0.0.0.0',//ip
      port: 19915,//端口号
      open: true,//是否自动在浏览器打开
      https: false,//是否开启https
      //反向代理（跨域）
      proxy: {
        '/api': {
          target: 'http://localhost:5000/',
          // target: 'http://116.63.157.19/',
          changeOrigin: true,
          rewrite: (pathStr) => pathStr.replace(new RegExp('^/api'), '')
        },
      },

    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/assets/scss/element.scss" as *;`
        }
      }
    },
    // 强制预构建插件包
    // optimizeDeps: {
    //   include: ['axios'],
    // },
    //别名
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src'),
        "@api": path.resolve(__dirname, './src/api'),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@views": path.resolve(__dirname, "./src/views"),
        "@components": path.resolve(__dirname, "./src/components"),
      }
    },
    build: {
      // 打包路径
      assetsDir: "./static",
      // 压缩
      // Terser 相对较慢，但大多数情况下构建后的文件体积更小。ESbuild 最小化混淆更快但构建后的文件相对更大。
      //启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      minify: !isEnvProduction ? 'esbuild' : 'terser',
      terserOptions: {
        compress: {
          // 生产环境去除console
          drop_console: isEnvProduction,
          drop_debugger: isEnvProduction
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      // 取消计算文件大小，加快打包速度
      brotliSize: false,
      sourcemap: false,
      outDir: 'dist',
      rollupOptions: {
        input: {
          // 入口文件
          main: path.resolve(__dirname, "index.html"),
          // 其他入口
          // nested: resolve(__dirname, 'xxxx.html')
        },
        output: {
          // chunkFileNames: 'static/js/[name]-[hash].js',
          // entryFileNames: 'static/js/[name]-[hash].js',
          // assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks (id) { //静态资源分拆打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        },

      },
    },
  }
})

