import { loginAPI } from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    zsPCToken: getToken() || ''
  },
  mutations: {
    // mutations中的方法只有一种调用方式, store.commit('方法名', 数据)
    setToken (state, newToken) {
      state.zsPCToken = newToken
      setToken(newToken)
    },
    removeToken (state) {
      state.zsPCToken = ''
      removeToken()
    }
  },
  actions: {
    async loginAction (store, data) {
      const res = await loginAPI(data)
      store.commit('setToken', res.data.token)
    }
  }
}

// 使用state中的数据
// 如果只有一处用了state中的数据,可以使用this.$store.state.user.xx
// 如果是多个,使用辅助函数
// import { mapState } from "vuex"
// computed: {
//   ...mapState('模块名',['属性名1','属性名2',...])
// }
