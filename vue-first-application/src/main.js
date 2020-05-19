import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueMaterial);

//Vue.prototype.$adresse = "http://localhost:3000";
Vue.prototype.$adresse = "http://iutabgdinlpvm-10.iutbourg.univ-lyon1.fr:3000/";

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
