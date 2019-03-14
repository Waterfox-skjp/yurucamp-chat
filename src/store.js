import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import constants from './constants'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    loginStatus: false,
    iconData: {
      imgPath: 'kagamihara-default',
      name: '各務原なでしこ',
      version: 'デフォルト'
    },
    bgImage: 'https://firebasestorage.googleapis.com/v0/b/yurucamp-chat.appspot.com/o/images%2Fbg-default.jpg?alt=media&token=22f29b01-f5b1-4831-9b45-70d7e0ef067c'
  },
  mutations: {
    [constants.mutations.user](state, user) {
      state.user = user
    },
    [constants.mutations.loginStatus](state, loginStatus) {
      state.loginStatus = loginStatus
    },
    [constants.mutations.icon](state, x) {
      state.iconData = x
    },
    [constants.mutations.bgImage](state, y) {
      state.bgImage = y
    }
  },
  plugins: [createPersistedState({ storage: window.sessionStorage, key: 'yurucamp-chat' })]
})
