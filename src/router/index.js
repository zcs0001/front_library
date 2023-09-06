import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'
import Cookies from 'js-cookie'
Vue.use(VueRouter)

const routes = [
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue')
  },
  // 主页
  // 此时登录和Layout路由是平级的，登录界面不会嵌到Layout中，达到登录完切换界面的功能
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: 'home',
    // children中所有路由都会嵌到Layout中
    // 下面的完整路由是拼起来的 "/"+"admin"这种
    children: [
      {
        path: 'home',
        name: 'HomeView',
        component: () => import('@/views/home/HomeView.vue')
      },
      // Admin
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin/Admin.vue')
      },
      {
        path: 'addAdmin',
        name: 'addAdmin',
        component: () => import('@/views/admin/AddAdmin.vue')
      },
      {
        path: 'editAdmin',
        name: 'EditAdmin',
        component: () => import('@/views/admin/EditAdmin.vue')
      },
      //User
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/User.vue')
      },
      {
        path: 'addUser',
        name: 'AddUser',
        component: () => import('@/views/user/AddUser.vue')
      },
      {
        path: 'editUser',
        name: 'EditUser',
        component: () => import('@/views/user/EditUser.vue')
      },
      //Category
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/Category.vue')
      },
      {
        path: 'addCategory',
        name: 'AddCategory',
        component: () => import('@/views/category/AddCategory.vue')
      },
      {
        path: 'editCategory',
        name: 'EditCategory',
        component: () => import('@/views/category/EditCategory.vue')
      },
      //  ====  Book  ====
      { path: 'book', name: 'Book', component: () => import('@/views/book/Book.vue') },
      { path: 'addBook', name: 'AddBook', component: () => import('@/views/book/AddBook.vue') },
      { path: 'editBook', name: 'EditBook', component: () => import('@/views/book/EditBook.vue') },
      //  ====  Borrow  ====
      { path: 'borrow', name: 'Borrow', component: () => import('@/views/borrow/Borrow.vue') },
      { path: 'addBorrow', name: 'AddBorrow', component: () => import('@/views/borrow/AddBorrow.vue') },
      { path: 'editBorrow', name: 'EditBorrow', component: () => import('@/views/borrow/EditBorrow.vue') },
      // ==== Retur ====
      { path: 'retur', name: 'Retur', component: () => import('@/views/retur/Retur.vue') }
    ]
  },

  // 404界面，要写在最下面，只有当上面的路由都没有的时候，就会访问404
  {
    path: "*",
    component: () => import("@/views/404.vue")
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果要去的路由是'/login',则可以直接放行
  if (to.path === '/login') next()
  const admin = Cookies.get("admin")
  // 如果要去的路由不是'/login'且Cookie中没有保存admin,则强制退回到登录页面
  // 这行校验发生在路由改变的时候，因此要求我们在登录的时候必须先将数据存到Cookie中再跳转到主页'/'
  // 如果先跳转到主页'/',就会来到路由守卫这里，则to.path!=='/login'满足，但此时Cookie没有保存，因此!admin也满足，于是又会跳到"/login"
  if (!admin && to.path !== '/login') return next("/login")
  // 访问 /home 的时候，并且cookie里面存在数据，就直接放行
  next()
})
export default router
