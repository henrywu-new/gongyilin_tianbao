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
    path: '/print',
    component: () => import('@/views/print'),
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
    meta: { roles: ['admin'] },
    children: [
      {
        path: '/user',
        meta: {
          title: '用户管理',
          roles: ['admin'],
          icon: 'el-icon-user-solid'
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
    meta: { roles: ['admin'] },
    children: [
      {
        path: '/user/baseinfo',
        meta: {
          title: '用户基础数据',
          roles: ['admin'],
          icon: 'el-icon-user-solid'
        },
        component: () => import('@/views/baseinfo/index')
      },
      {
        path: '/user/baseinfo/add',
        meta: {
          title: '添加用户基础数据',
          roles: ['admin'],
          icon: 'el-icon-user-solid'
        },
        component: () => import('@/views/baseinfo/add'),
        hidden: true
      },
      {
        path: '/user/baseinfo/edit',
        name: 'baseinfEdit',
        meta: {
          title: '修改用户基础数据',
          roles: ['admin'],
          icon: 'el-icon-user-solid'
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
    meta: { roles: ['admin'] },
    children: [
      {
        path: '/baseconfigg',
        name: 'baseconfig',
        component: () => import('@/views/baseconfig'),
        meta: { title: '配置基本数据', roles: ['admin'], icon: 'el-icon-s-platform' }
      },
      {
        path: '/baseconfigg/add',
        name: 'baseconfigAdd',
        component: () => import('@/views/baseconfig/add'),
        meta: { title: '添加基本数据', roles: ['admin'], icon: 'el-icon-s-platform' },
        hidden: true
      },
      {
        path: '/baseconfigg/edit',
        name: 'baseconfigEdit',
        component: () => import('@/views/baseconfig/edit'),
        meta: { title: '修改基本数据', roles: ['admin'], icon: 'el-icon-s-platform' },
        hidden: true
      }
    ]
  },
  {
    path: '/fire/index',
    component: Layout,
    redirect: '/fire',
    name: 'fire',
    meta: { title: '乡镇防火值班管理', roles: ['ordinary'], icon: 'el-icon-s-tools' },
    children: [
      {
        path: '/fire',
        name: 'fireInit',
        meta: { title: '系统初始化', roles: ['ordinary'] },
        component: () => import('@/views/fire/index')
      },
      {
        path: '/fire/log',
        name: 'logList',
        meta: { title: '值班日志', roles: ['ordinary'] },
        component: () => import('@/views/fire/log/index')
      },
      {
        path: '/fire/log/add',
        name: 'logAdd',
        meta: { title: '添加值班日志', roles: ['ordinary'] },
        component: () => import('@/views/fire/log/add'),
        hidden: true
      },
      {
        path: '/fire/log/edit',
        name: 'logEdit',
        meta: { title: '修改值班日志', roles: ['ordinary'] },
        component: () => import('@/views/fire/log/edit'),
        hidden: true
      }
    ]
  },
  {
    path: '/template/index',
    component: Layout,
    redirect: '/template',
    name: 'template',
    meta: { title: '模板管理', roles: ['admin'], icon: 'el-icon-s-order' },
    children: [
      {
        path: '/template',
        name: 'template',
        meta: { title: '模板管理', roles: ['admin'] },
        component: () => import('@/views/template/index')
      },
      {
        path: '/template/add',
        name: 'templateAdd',
        meta: { title: '添加模板', roles: ['admin'] },
        component: () => import('@/views/template/add'),
        hidden: true
      },
      {
        path: '/template/edit',
        name: 'templateEdit',
        meta: { title: '修改模板', roles: ['admin'] },
        component: () => import('@/views/template/edit'),
        hidden: true
      }
    ]
  },
  // {
  //   path: '/connect',
  //   component: Layout,
  //   meta: { roles: ['ordinary'] },
  //   // redirect: '/connect-us',
  //   children: [
  //     {
  //       path: '/connect-us',
  //       component: () => import('@/views/connect'),
  //       meta: { title: '系统帮助', roles: ['ordinary'], icon: 'el-icon-s-promotion', target: '_blank' }
  //     }
  //   ]
  // },
  {
    path: 'system-help',
    component: Layout,
    meta: { roles: ['ordinary'] },
    children: [
      {
        path: 'https://s.r.sn.cn/nxCNAA',
        meta: { title: '系统帮助', roles: ['ordinary'], icon: 'link', target: '_blank' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    meta: { roles: ['ordinary'] },
    children: [
      {
        path: 'https://s.r.sn.cn/HVNBtc',
        meta: { title: '第三方拼图工具', roles: ['ordinary'], icon: 'link', target: '_blank' }
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
