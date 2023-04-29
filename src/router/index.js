import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '管理系统', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user',
    name: 'user',
    meta: { roles: ['admin'], icon: 'el-icon-user-solid' },
    children: [
      {
        path: '/user',
        meta: {
          title: '用户管理',
          roles: ['admin']
        },
        component: () => import('@/views/user/index')
      },
      {
        path: '/user/add',
        name: 'userAdd',
        meta: {
          title: '用户添加',
          roles: ['admin']
        },
        component: () => import('@/views/user/add'),
        hidden: true
      },
      {
        path: '/user/edit',
        name: 'userEdit',
        meta: {
          title: '修改用户',
          roles: ['admin']
        },
        component: () => import('@/views/user/edit'),
        hidden: true
      }
    ]
  },
  {
    path: '/user/base',
    component: Layout,
    redirect: '/user/baseinfo',
    name: 'userBase',
    meta: { roles: ['admin'], icon: 'el-icon-user-solid' },
    children: [
      {
        path: '/user/baseinfo',
        meta: {
          title: '用户基础数据',
          roles: ['admin']
        },
        component: () => import('@/views/baseinfo/index')
      },
      {
        path: '/user/baseinfo/add',
        meta: {
          title: '添加用户基础数据',
          roles: ['admin']
        },
        component: () => import('@/views/baseinfo/add'),
        hidden: true
      },
      {
        path: '/user/baseinfo/edit',
        name: 'baseinfEdit',
        meta: {
          title: '修改用户基础数据',
          roles: ['admin']
        },
        component: () => import('@/views/baseinfo/edit'),
        hidden: true
      }
    ]
  },
  {
    path: '/baseconfig',
    component: Layout,
    redirect: '/baseconfig',
    meta: { roles: ['admin'], icon: 'el-icon-user-solid' },
    children: [
      {
        path: '/baseconfig',
        name: 'baseconfig',
        component: () => import('@/views/baseconfig'),
        meta: { title: '配置基本数据', roles: ['admin'] }
      },
      {
        path: '/baseconfigg/add',
        name: 'baseconfigAdd',
        component: () => import('@/views/baseconfig/add'),
        meta: { title: '添加基本数据', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/baseconfigg/edit',
        name: 'baseconfigEdit',
        component: () => import('@/views/baseconfig/edit'),
        meta: { title: '修改基本数据', roles: ['admin'] },
        hidden: true
      }
    ]
  },
  {
    path: '/village',
    component: Layout,
    redirect: '/village',
    meta: { roles: ['admin'], icon: 'el-icon-user-solid' },
    children: [
      {
        path: '/village',
        name: 'village',
        component: () => import('@/views/village'),
        meta: { title: '村庄信息', roles: ['admin'] }
      },
      {
        path: '/village/add',
        name: 'villageAdd',
        component: () => import('@/views/village/add'),
        meta: { title: '添加村庄', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/village/edit',
        name: 'villageEdit',
        component: () => import('@/views/village/edit'),
        meta: { title: '添加村庄', roles: ['admin'] },
        hidden: true
      }
    ]
  },
  {
    path: '/gyl',
    component: Layout,
    redirect: '/gongyilin',
    meta: { title: '公益林', roles: ['admin'], icon: 'el-icon-s-shop' },
    children: [
      {
        path: '/gongyilin',
        name: 'gongyilin',
        component: () => import('@/views/gongyilin'),
        meta: { title: '数据管理', roles: ['admin'] }
      },
      {
        path: '/gongyilin/add',
        name: 'gongyilinAdd',
        component: () => import('@/views/gongyilin/add'),
        meta: { title: '添加', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/gongyilin/edit',
        name: 'gongyilinEdit',
        component: () => import('@/views/gongyilin/edit'),
        meta: { title: '修改', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/gongyilin/diff',
        name: 'gongyilinDiff',
        component: () => import('@/views/gongyilin/diff'),
        meta: { title: '公益林相差', roles: ['admin'] }
      },
      {
        path: '/gongyilin/diff-village',
        name: 'gongyilinDiffVillage',
        component: () => import('@/views/gongyilin/diff-village'),
        meta: { title: '乡村公益林相差', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/tb',
    component: Layout,
    redirect: '/tianbao',
    meta: { title: '天保', roles: ['admin'], icon: 'el-icon-s-shop' },
    children: [
      {
        path: '/tianbao',
        name: 'tianbao',
        component: () => import('@/views/tianbao'),
        meta: { title: '数据管理', roles: ['admin'] }
      },
      {
        path: '/tianbao/add',
        name: 'tianbaoAdd',
        component: () => import('@/views/tianbao/add'),
        meta: { title: '添加', roles: ['admin'] },
        hidden: true
      },
      {
        path: '/tianbao/diff',
        name: 'gongyilinDiff',
        component: () => import('@/views/tianbao/diff'),
        meta: { title: '天保相差', roles: ['admin'] }
      },
      {
        path: '/tianbao/diff-village',
        name: 'tianbaoDiffVillage',
        component: () => import('@/views/tianbao/diff-village'),
        meta: { title: '乡村天保相差', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
