import { ConfigEnv, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path'


// https://vite.dev/config/
const CWD = process.cwd();

export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, CWD);
  console.log('env',env)

  const { VITE_BASE_URL, VITE_DEV_SERVER_PORT,VITE_DEV_SERVER_URL } = loadEnv(mode, CWD);

  return{
    base: VITE_BASE_URL,
    resolve: {
      alias:[
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
        },
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js', // compile template
        },
      ]
    },
    css: {
      preprocessorOptions: {
        less: {
          // additionalData: `@import "@/style/global.less";`,
          javascriptEnabled: true,
          modifyVars: {
            // 'primary-color': '#1DA57A',
            // 'link-color': '#1DA57A',
            // 'border-radius-base': '2px',
            hack: `true; @import (reference) "${resolve(
              'src/style/breakpoint.less'
            )}";`,
          },
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
    ],

    server: {
      port: Number(VITE_DEV_SERVER_PORT),
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: VITE_DEV_SERVER_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    }
  }
};
