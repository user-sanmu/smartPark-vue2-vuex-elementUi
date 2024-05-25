import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  baseURL: 'https://api-hmzs.itheima.net/v1',
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = store.state.user.zsPCToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.data.code !== 10000) {
      Message.error(response.data.msg)
      return Promise.reject(response.data)
    }
    return response.data
  },
  error => {
    console.dir(error)
    if (error.response.status === 401) {
      store.commit('user/removeToken')
      router.push('/login')
    }
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default service
