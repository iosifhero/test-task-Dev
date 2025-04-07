import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createYmaps } from 'vue-yandex-maps';
import App from './App.vue';

const app = createApp(App);

app.use(createPinia());
app.use(
  createYmaps({
    apikey: '7f880bcf-7c94-42d6-8428-b6f5111190ce',
    // servicesApikeys: { router: '' },
    // api для роутов платное + у меня выбивает ошибку при попытке подключить
  }),
);

app.mount('#app');
