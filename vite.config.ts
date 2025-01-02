import { ConfigEnv, loadEnv, UserConfig } from 'vite'
import path from "node:path";
import vue from '@vitejs/plugin-vue';


// https://vite.dev/config/
const CWD = process.cwd();

export default ({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, CWD);
  console.log('env',env)

  const { VITE_BASE_URL, VITE_DEV_SERVER_PORT,VITE_DEV_SERVER_URL } = loadEnv(mode, CWD);

  return{
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          // additionalData: `@import "@/style/global.less";`,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      vue(),
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
