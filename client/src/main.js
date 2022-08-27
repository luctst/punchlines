import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Toasted from 'vue-toasted';
import vSelect from 'vue-select';
import VModal from 'vue-js-modal';
import messages from './i18n/messages';
import App from './App.vue';
import router from './router';
import store from './store';

import 'vue-select/dist/vue-select.css';
import 'vue-js-modal/dist/styles.css';
import './assets/main.scss';

Vue.config.productionTip = false;

Vue.use(
  Toasted,
  {
    position: 'bottom-right',
    duration: 4000,
    keepOnHover: true,
    iconPack: 'material',
    action: [
      {
        text: 'Close',
        onClick: (e, toastObject) => {
          toastObject.goAway(0);
        },
      },
    ],
  },
);

Vue.use(VueI18n);
Vue.use(VModal, { dialog: true });

const i18n = new VueI18n({
  locale: navigator.language.includes('-') ? navigator.language.split('-')[0] : navigator.language,
  messages,
});

Vue.component('v-select', vSelect);
new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
