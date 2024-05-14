import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
  namespaced: true,
  // 组合模块的配置项
  modules: {
    user
  }
})

export default store
