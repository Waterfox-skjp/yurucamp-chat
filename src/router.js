import Vue from 'vue'
import Router from 'vue-router'
import Chat from './views/Chat'
import Signup from './views/Signup'
import Signin from './views/Signin'
import constants from './constants'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: constants.path.TOP,
      name: 'Chat',
      component: Chat,
      meta: { title: '' }
    },
    {
      path: constants.path.SIGN_IN,
      component: Signin,
      meta: {
        isPublic: true,
        title: 'ログイン'
      }
    },
    {
      path: constants.path.SIGN_UP,
      component: Signup,
      meta: {
        isPublic: true,
        title: '新規登録'
      }
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
