<template>
  <main>
    <div class="signin-wrap">
      <div class="icon">
        <img src="../assets/icon.svg" alt="アイコン">
      </div>
      <h1>ログイン</h1>
      <div class="btn-google" @click="loginWithGoogle">
        <img src="../assets/google.svg" alt="">
        <p>Googleでサインインする</p>
      </div>
      <div class="separator">
        <p>または</p>
      </div>
      <form @submit.prevent="signIn">
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
        <div class="row">
          <button type="submit" class="btn-submit">
            ログインする
          </button>
        </div>
        <div class="row">
          <label><input v-model="userInfo.rememberme" type="checkbox" value="remember-me">記憶する</label>
        </div>
      </form>
      <div class="form-signin">
        <router-link :to="signupPath">
          アカウントを登録する
        </router-link>
      </div>
    </div>
  </main>
</template>

<script>
import firebase from '~/plugins/firebase.js'

export default {
  name: 'SignIn',
  data () {
    return {
      userInfo: {
        userid: null,
        password: null,
        rememberme: false
      }
    }
  },
  computed: {
    signupPath () {
      return { path: '/signup' }
    }
  },
  created () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  },
  methods: {
    signIn (evt) {
      this.loadShow()
      if (this.userInfo.userid == null || this.userInfo.password == null) {
        this.loadCancel()
        alert('メールアドレス、パスワードを入力してください')
      } else {
        this.$parent.loading = true
        evt.preventDefault()
        firebase.auth()
          .signInWithEmailAndPassword(this.userInfo.userid, this.userInfo.password)
          .then((result) => {
            const { apiKey, appName, authDomain, createdAt, displayName, email, emailVerified, isAnonymous, lastLoginAt, phoneNumber, photoURL, providerData, redirectEventId, stsTokenManager, tenantId, uid } = result.user
            this.$store.commit('user', { apiKey, appName, authDomain, createdAt, displayName, email, emailVerified, isAnonymous, lastLoginAt, phoneNumber, photoURL, providerData, redirectEventId, stsTokenManager, tenantId, uid })
            this.$store.commit('loginStatus', true)
            this.userInfo.password = ''
            if (this.userInfo.rememberme) {
              localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            } else {
              localStorage.removeItem('userInfo')
            }
            this.$router.push(
              this.$route.query.redirect ? this.$route.query.redirect : '/'
            )
          })
          .catch((error) => {
            const errorCode = error.code
            // const errorMessage = error.message
            // alert(errorCode + '\n' + errorMessage)
            this.loadCancel()
            if (errorCode === 'auth/wrong-password') {
              alert('パスワードが間違っているか、入力されていません')
            } else if (errorCode === 'auth/user-not-found') {
              alert('アカウントが登録されていません')
            } else if (errorCode === 'auth/invalid-email') {
              alert('メールアドレスを入力してください')
            } else if (errorCode === 'auth/argument-error') {
              alert('メールアドレス、パスワードを入力してください')
            }
          })
      }
    },
    loadShow () {
      this.$parent.loading = true
    },
    loadCancel () {
      this.$parent.loading = false
    },
    loginWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth()
        .signInWithPopup(provider).then((result) => {
          this.$store.commit('user', result.user)
          this.$store.commit('loginStatus', true)
          this.$router.push(
            this.$route.query.redirect ? this.$route.query.redirect : '/'
          )
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.log(errorCode, errorMessage)
          alert('ログインに失敗しました')
        })
        .catch(() => {
          alert('ログインに失敗しました')
        })
    }
  }
}
</script>
