import { auth } from '~/plugins/firebase.js'

export default function ({ route, store, redirect }) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch('auth/gotUser', user)
    } else if (route.name !== 'login') {
      redirect('/login')
    }
  })
}
