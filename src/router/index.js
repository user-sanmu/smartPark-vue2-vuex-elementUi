import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/workbench',
    children: [{
      path: '/workbench',
      name: 'workbench',
      component: () => import('@/views/Workbench/index'),
      meta: { title: '工作台', icon: 'el-icon-eleme' }
    }]
  },
  {
    path: '/park',
    component: Layout,
    name: 'park',
    meta: { title: '园区管理', icon: 'el-icon-office-building' },
    children: [{
      path: '/building',
      name: 'building',
      meta: { title: '楼宇管理' },
      component: () => import('@/views/park/building/index')
    },
    {
      path: '/enterprise',
      name: 'enterprise',
      meta: { title: '企业管理' },
      component: () => import('@/views/park/enterprise/index')
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter()
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher
}

export default router
