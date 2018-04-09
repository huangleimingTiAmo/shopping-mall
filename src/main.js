// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import  infiniteScroll from 'vue-infinite-scroll'
import Vuex from 'vuex'


Vue.use(VueLazyload,{
  loading:"/static/loading/loading-bars.svg"
})
Vue.use(infiniteScroll)

Vue.use(Vuex);
const store = new Vuex.Store({
  state:{
    
    cartCount:0
  },
  mutations:{
   
    updateCartCount(state,cartCount){
      state.cartCount+=cartCount
    },
    initCartCount(state,cartCount){
      state.cartCount=cartCount
      
    }
  }
})


Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  router,
  store,
 
  template: '<App/>',
  
  components: { App }
});
