// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import jQuery from 'jquery'
global.jQuery = jQuery
global.$ = jQuery
let Bootstrap = require('bootstrap')
import 'bootstrap/dist/css/bootstrap.css'
import App from './App'
//var VueResource = require('vue-resource');

import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import Hello from './components/HelloWorld.vue'
import dailyScores from './components/dailyScores.vue'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
	{path: '/', component: dailyScores},
	{path: '/home', component: dailyScores}
]

const router = new VueRouter ({
	routes: routes
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
