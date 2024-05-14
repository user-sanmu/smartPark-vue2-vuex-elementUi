import { loginAPI } from '@/api/user'
import {
  setPwd,
  setUname,
  getPwd,
  getToken,
  getUname,
  setToken
} from '@/utils/auth'

export default {
  namespaced: true,
  state: {
    zsPCToken: getToken() || '',
    zsUname: getUname() || '',
    zsPwd: getPwd() || ''
  },
  mutations: {
    // mutations中的方法只有一种调用方式, store.commit('方法名', 数据)
    setToken (state, newToken) {
      state.zsPCToken = newToken
      setToken(newToken)
    },
    setUname (state, newUname) {
      state.zsUname = newUname
      setUname(newUname)
    },
    setPwd (state, newPwd) {
      state.zsPwd = newPwd
      setPwd(newPwd)
    }
  },
  actions: {
    async loginAction (store, data) {
      console.log(data.checked)
      if (data.checked) {
        store.commit('setUname', data.username)
        store.commit('setPwd', data.password)
        // localStorage.setItem('zsUname', data.username)
        // localStorage.setItem('zsPwd', data.password)
      }
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
