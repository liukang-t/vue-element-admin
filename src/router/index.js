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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/merchant',
    component: Layout,
    redirect: '/merchant/index',
    name: 'Merchant',
    meta: {
      title: '商户管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/merchant/index'),
        name: 'MerchantIndex',
        meta: { title: '商户概览' }
      },
      {
        path: 'list',
        component: () => import('@/views/merchant/list'),
        name: 'MerchantList',
        meta: { title: '商户列表' }
      },
      {
        path: 'app',
        component: () => import('@/views/merchant/app'),
        name: 'AppList',
        meta: { title: '应用列表' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/index'),
        name: 'AdminIndex',
        meta: { title: '管理员管理', icon: 'user' }
      }
    ]
  },
  {
    path: '/provider',
    component: Layout,
    redirect: '/provider/list',
    name: 'Provider',
    meta: {
      title: '服务商管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/provider/list'),
        name: 'ProviderList',
        meta: { title: '服务商列表' }
      }
    ]
  },
  {
    path: '/payment',
    component: Layout,
    redirect: '/payment/order',
    name: 'Payment',
    meta: {
      title: '支付管理',
      icon: 'money'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/payment/order'),
        name: 'PaymentOrder',
        meta: { title: '支付订单' }
      },
      {
        path: 'refund',
        component: () => import('@/views/payment/refund'),
        name: 'PaymentRefund',
        meta: { title: '退款订单' }
      },
      {
        path: 'transfer',
        component: () => import('@/views/payment/transfer'),
        name: 'PaymentTransfer',
        meta: { title: '转账订单' }
      },
      {
        path: 'notification',
        component: () => import('@/views/payment/notification'),
        name: 'PaymentNotification',
        meta: { title: '商户通知' }
      }
    ]
  },
  {
    path: '/payment-config',
    component: Layout,
    redirect: '/payment-config/interface',
    name: 'PaymentConfig',
    meta: {
      title: '支付配置',
      icon: 'setting'
    },
    children: [
      {
        path: 'interface',
        component: () => import('@/views/payment-config/interface'),
        name: 'PaymentInterface',
        meta: { title: '支付接口' }
      },
      {
        path: 'method',
        component: () => import('@/views/payment-config/method'),
        name: 'PaymentMethod',
        meta: { title: '支付方式' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
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
