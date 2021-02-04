import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter  from "vue-router";
import Home from './components/Home'
import LogIn from './components/Login'

Vue.config.productionTip = false
Vue.use(VueRouter)


const routes = [
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/",
    component: LogIn,
  }  
];

const router = new VueRouter({
  routes,
  mode: "history",
});

export default router;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
