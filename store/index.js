// 保持させるデータ
export const state = () => ({
  user: {},
  loginStatus: false,
  iconData: {
    imgPath: 'kagamihara-default',
    name: '各務原なでしこ',
    version: 'デフォルト'
  },
  bgImage: 'https://firebasestorage.googleapis.com/v0/b/yurucamp-chat.appspot.com/o/images%2Fbg-default.jpg?alt=media&token=22f29b01-f5b1-4831-9b45-70d7e0ef067c'
})

// 同期処理
export const mutations = {
  user (state, user) {
    state.user = user
  },
  loginStatus (state, loginStatus) {
    state.loginStatus = loginStatus
  },
  iconData (state, x) {
    state.iconData = x
  },
  bgImage (state, y) {
    state.bgImage = y
  }
}
