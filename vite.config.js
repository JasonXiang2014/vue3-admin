import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来

// 统一后端基础地址（开发/生产分离，只写基础路径，不写具体接口）
const baseApiUrl = {
  development: 'http://127.0.0.1:28019/manage-api/v1', // 开发环境：后端接口公共基础路径
  beta: 'http://backend-api-02.newbee.ltd/manage-api/v1', // 测试环境
  release: 'http://backend-api-02.newbee.ltd/manage-api/v1' // 生产环境
}
// https://vitejs.dev/config/
export default ({ mode }) => defineConfig({
  plugins: [
    vue({
      template: {
        // 开启Vue模板的HMR（Vite 2.x需显式开启，默认部分场景关闭）
        hot: true
      }
    }),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),
    ElementPlus()
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: baseApiUrl[mode], // 代理到对应环境的后端接口公共基础路径
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // 重写 api 为 空，就是去掉它
      }
    }
  },
  css: {
    preprocessorOptions: {
      // 覆盖掉element-plus包中的主题变量文件
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
})
