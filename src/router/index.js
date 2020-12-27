import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: ()=> {  // 路由懒加载
      return import('../views/Home.vue')
    },
    children:[
      {
        path: '/users',
        name: 'Users',
        component: ()=> {  // 路由懒加载
          return import('../components/Users.vue')
        }
      },
      {
        path: '/roles',
        name: 'Roles',
        component: ()=> {  // 路由懒加载
          return import('../components/Roles.vue')
        }
      },
      {
        path: '/rights',
        name: 'Rights',
        component: ()=> {  // 路由懒加载
          return import('../components/Rights.vue')
        }
      },
      {
        path: '/categories',
        name: 'Categories',
        component: ()=> {  // 路由懒加载
          return import('../components/Categories.vue')
        }
      },
      {
        path: '/goods',
        name: 'Goods',
        component: ()=> {  // 路由懒加载
          return import('../components/Goods.vue')
        },            
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: ()=> {  // 路由懒加载
          return import('../components/Add.vue')
        }
      },
      {
        path: '/params',
        name: 'Params',
        component: ()=> {  // 路由懒加载
          return import('../components/Params.vue')
        }
      },
      {
        path: '/reports',
        name: 'Reports',
        component: ()=> {  // 路由懒加载
          return import('../components/Reports.vue')
        }
      },
      {
        path: '/orders',
        name: 'Orders',
        component: ()=> {  // 路由懒加载
          return import('../components/Orders.vue')
        }
      },
      {
        path:'/home',
        redirect:"/wel"
      },
      {
        path: '/wel',
        name: 'Wel',
        component: ()=> {  // 路由懒加载
          return import('../components/Wel.vue')
        }
      },

    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: ()=> {  // 路由懒加载
      return import('../views/Login.vue')
    }
  },
  {
    path:'/',
    redirect:"/login"
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to,form,next)=>{
    // 1.如果访问的是登录页面（无需权限），直接放行
      if (to.path === '/login') return next()
      // 2.如果访问的是有登录权限的页面，先要获取token
      const token = window.sessionStorage.getItem('sg_token')
      // 2.1如果token为空，强制跳转到登录页面；否则，直接放行
      if (!token) return next('/login')
      next();
})
export default router
