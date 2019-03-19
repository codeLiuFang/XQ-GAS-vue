import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import NewLayout from '@/views/layout/NewLayout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const dashborad = [
  {
    name: '首页'
  }
]

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: NewLayout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: dashborad[0].name, icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/company',
    component: NewLayout,
    redirect: '/company/index',
    meta: { title: '企业管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'company',
        component: () => import('@/views/company/index'),
        name: 'company',
        meta: { title: '企业信息', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'inGasFill',
        component: () => import('@/views/inGasFill/index'),
        name: 'inGasFill',
        meta: { title: '企业用气', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/price',
    component: NewLayout,
    redirect: '/price/index',
    meta: { title: '价格管理', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'price',
        component: () => import('@/views/price/index'),
        name: 'price',
        meta: { title: '价格录入', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'gasSource',
        component: () => import('@/views/gasSource/index'),
        name: 'gasSource',
        meta: { title: '气源管理', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  {
    path: '/tableSearchPrediction',
    component: NewLayout,
    redirect: '/tableSearchPrediction/index',
    meta: { title: '气量预测', icon: 'component', role: ['管理员'] },
    children: [
      {
        path: 'tableSearchPrediction',
        component: () => import('@/views/tableSearchPrediction/index'),
        name: 'tableSearchPrediction',
        meta: { title: '预测结果', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'weatherInfo',
        component: () => import('@/views/weatherInfo/index'),
        name: 'weatherInfo',
        meta: { title: '天气录入', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'heat',
        component: () => import('@/views/heat/index'),
        name: 'heat',
        meta: { title: '供暖区间', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'gasReport',
        component: () => import('@/views/gasReport/index'),
        name: 'heat',
        meta: { title: '报批记录', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  // {
  //   path: '/inGasFill',
  //   component: Layout,
  //   redirect: '/inGasFill/index',
  //   meta: { title: '气量填报', icon: 'component', role: ['管理员'] },
  //   children: [
  //     {
  //       path: 'inGasFill',
  //       component: () => import('@/views/inGasFill/index'),
  //       name: 'inGasFill',
  //       meta: { title: '内部填报', icon: 'edit', noCache: true, role: ['管理员'] }
  //     },
  //     {
  //       path: 'outGasFill',
  //       component: () => import('@/views/outGasFill/index'),
  //       name: 'outGasFill',
  //       meta: { title: '外部填报', icon: 'edit', noCache: true, role: ['111'] }
  //     }
  //   ]
  // },
  {
    path: '/system',
    component: NewLayout,
    redirect: '/system/org',
    alwaysShow: true,
    meta: { title: 'systemmanage', icon: 'component', role: ['管理员'] },
    children: [
      // {
      //   path: 'org',
      //   component: () => import('@/views/org/index'),
      //   name: 'org',
      //   meta: { title: 'org', icon: 'edit', noCache: true }
      // },
      // {
      //   path: 'dict',
      //   component: () => import('@/views/dict/index'),
      //   name: 'dict',
      //   meta: { title: 'dict', icon: 'edit', noCache: true }
      // },
      {
        path: 'actor',
        component: () => import('@/views/actor/index'),
        name: 'actor',
        meta: { title: 'actor', icon: 'edit', noCache: true, role: ['管理员'] }
      },
      {
        path: 'user',
        component: () => import('@/views/user/index'),
        name: 'user',
        meta: { title: 'user', icon: 'edit', noCache: true, role: ['管理员'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
