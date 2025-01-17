import { createApp } from 'vue'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue';
import '@arco-design/web-vue/dist/arco.css';
import '@/style/global.less';
import store from './store';
import router from './router';
import i18n from '@/locale'

const app = createApp(App);
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(router);
app.use(store);
app.use(i18n);
app.mount('#app');