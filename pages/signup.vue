<template>
  <main>
    <div class="signup-wrap">
      <div class="icon">
        <img src="../assets/icon.svg" alt="アイコン">
      </div>
      <h1>新規登録</h1>
      <form @submit.prevent="signUp">
        <div class="row">
          <label for="inputUserName">メールアドレス：</label>
          <input
            id="inputUserName"
            v-model="userInfo.userid"
            type="email"
          >
        </div>
        <div class="row">
          <label for="inputPassword">パスワード：</label>
          <input
            id="inputPassword"
            v-model="userInfo.password"
            type="password"
          >
        </div>
        <div class="row handle-name">
          <label for="inputHandleName">ハンドルネーム：</label>
          <input
            id="inputHandleName"
            v-model="userInfo.displayName"
            type="text"
          >
        </div>
        <div class="row">
          <button type="submit" class="btn-submit">
            新規登録する
          </button>
        </div>
      </form>
      <div>
        <router-link :to="loginPath">
          ログイン画面へ
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>
import firebase from '~/plugins/firebase.js'

export default {
  name: 'SignUp',
  data () {
    return {
      userInfo: {
        userid: null,
        password: null,
        displayName: null
      }
    }
  },
  computed: {
    loginPath () {
      return { path: '/signin' }
    }
  },
  methods: {
    signUp () {
      this.loadShow()
      if (this.userInfo.userid == null || this.userInfo.password == null || this.userInfo.displayName == null) {
        this.loadCancel()
        alert('メールアドレス、パスワード、ハンドルネームを入力してください')
      } else {
        firebase.auth()
          .createUserWithEmailAndPassword(
            this.userInfo.userid,
            this.userInfo.password
          )
          .then((result) => {
            const { uid, displayName } = result.user
            this.$store.commit('user', { uid, displayName })
            this.$store.commit('loginStatus', true)
            result.user
              .updateProfile({
                displayName: this.userInfo.displayName
              })
              .then(() => {
                this.userInfo.password = ''
                localStorage.removeItem('userInfo')
                this.$router.push(
                  this.$route.query.redirect ? this.$route.query.redirect : '/'
                )
              })
          })
          .catch((error) => {
            const errorCode = error.code
            // const errorMessage = error.message
            // alert(errorCode + '\n' + errorMessage)
            this.loadCancel()
            if (errorCode === 'auth/email-already-in-use') {
              alert('このメールアドレスは既に登録されています')
            } else if (errorCode === 'auth/invalid-email') {
              alert('このパスワードは無効です')
            } else if (errorCode === 'auth/weak-password') {
              alert('パスワード強度が不十分です')
            }
          })
      }
    },
    loadShow () {
      this.$parent.loading = true
    },
    loadCancel () {
      this.$parent.loading = false
    }
  }
}
</script>
