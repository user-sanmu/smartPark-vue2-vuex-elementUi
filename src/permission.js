import router from './router'
import store from './store'

const whiteList = ['/login', '/404']
// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = store.state.user.zsPCToken
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
