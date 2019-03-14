import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import firebaseConfig from './config'
import constants from './constants'

// Font Awesome のメインファイルを import
import '@fortawesome/fontawesome-free-webfonts/css/fontawesome.css'

// 使用するカテゴリーのファイルを import
import '@fortawesome/fontawesome-free-webfonts/css/fa-solid.css'
// import '@fortawesome/fontawesome-free-webfonts/css/fa-brands.css'
// import '@fortawesome/fontawesome-free-webfonts/css/fa-regular.css'

// IE対策
import 'es6-promise/auto'

Vue.config.productionTip = false

firebase.initializeApp(firebaseConfig)
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log(JSON.stringify(user))
    store.commit(constants.mutations.user, user)
    store.commit(constants.mutations.loginStatus, true)
  } else {
    store.commit(constants.mutations.user, {})
    store.commit(constants.mutations.loginStatus, false)
  }
})

export const db = firebase.firestore()

router.beforeEach((to, from, next) => {
  const currentUser = store.state.user
  if (currentUser.uid) {
    if (to.path === constants.path.SIGN_IN) {
      firebase.auth().signOut().then(() => next())
    }
  }

  if (to.matched.some(record => record.meta.isPublic)) {
    next()
  } else {
    if (currentUser.uid) {
      next()
    } else {
      next({
        path: constants.path.SIGN_IN,
        query: {
          redirect: to.path
        }
      })
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
