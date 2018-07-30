// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import jQuery from 'jquery'
import 'bootstrap/dist/css/bootstrap.css'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import App from './App'
import dailyScores from './components/dailyScores.vue'
import schedule from './components/schedule.vue'
import loadingSpinner from './components/loadingSpinner.vue'

global.jQuery = jQuery;
global.$ = jQuery;

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
	{path: '/', component: dailyScores},
  {path: '/scores', component: dailyScores},
  {path: '/schedule', component: schedule},
  {path: '/loadingSpinner', component: loadingSpinner}
];

const router = new VueRouter ({
	routes: routes
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
