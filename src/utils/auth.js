// 专门用来操作cookie的方法包
// 内部封装了繁琐的操作方法 参数处理 暴露三个函数 get,set,remove
import Cookies from 'js-cookie'
import { TOKEN_KEY, UNAME_KEY, PWD_KEY } from '@/constants/KEY'
// 获取token的方法
export function getToken () {
  return Cookies.get(TOKEN_KEY)
}
export function getUname () {
  return Cookies.get(UNAME_KEY)
}
export function getPwd () {
  return Cookies.get(PWD_KEY)
}

// 设置方法
export function setToken (token) {
  return Cookies.set(TOKEN_KEY, token)
}
export function setUname (username) {
  return Cookies.set(UNAME_KEY, username)
}
export function setPwd (password) {
  return Cookies.set(PWD_KEY, password)
}

// 删除方法
export function removeToken () {
  return Cookies.remove(TOKEN_KEY)
}
export function removeUname () {
  return Cookies.remove(UNAME_KEY)
}
export function removePwd () {
  return Cookies.remove(PWD_KEY)
}
