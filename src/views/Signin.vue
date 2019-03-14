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
            type="email"
            id="inputUserName"
            v-model="userInfo.userid"
          >
        </div>
        <div class="row">
          <label for="inputPassword">パスワード：</label>
          <input
            type="password"
            id="inputPassword"
            v-model="userInfo.password"
          >
        </div>
        <div class="row">
          <button type="submit" class="btn-submit">ログインする</button>
        </div>
        <div class="row">
          <label><input type="checkbox" value="remember-me" v-model="userInfo.rememberme">記憶する</label>
        </div>
      </form>
      <div class="form-signin">
        <router-link :to='signupPath' >アカウントを登録する</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'
import constants from '@/constants'

export default {
  name: 'SignIn',
  data() {
    return {
      userInfo: {
        userid: null,
        password: null,
        rememberme: false
      }
    }
  },
  created: function () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  },
  computed: {
    signupPath () {
      return { path: constants.path.SIGN_UP }
    }
  },
  methods: {
    signIn(evt) {
      this.loadShow()
      if(this.userInfo.userid == null || this.userInfo.password == null) {
        this.loadCancel()
        alert('メールアドレス、パスワードを入力してください')
      } else {
        this.$parent.loading = true
        evt.preventDefault()
        firebase.auth()
          .signInWithEmailAndPassword(this.userInfo.userid, this.userInfo.password)
          .then((result) => {
            this.$store.commit(constants.mutations.user, result.user)
            this.$store.commit(constants.mutations.loginStatus, true)

            this.userInfo.password = ''
            if (this.userInfo.rememberme) {
              localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            } else {
              localStorage.removeItem('userInfo')
            }
            this.$router.push(
              this.$route.query.redirect ? this.$route.query.redirect : constants.path.TOP
            )
          })
          .catch((error) => {
            const errorCode = error.code
            // const errorMessage = error.message
            // alert(errorCode + '\n' + errorMessage)
            this.loadCancel()
            if(errorCode == 'auth/wrong-password') {
              alert('パスワードが間違っているか、入力されていません')
            }else if(errorCode == 'auth/user-not-found') {
              alert('アカウントが登録されていません')
            }else if(errorCode == 'auth/invalid-email'){
              alert('メールアドレスを入力してください')
            }else if(errorCode == 'auth/argument-error') {
              alert('メールアドレス、パスワードを入力してください')
            }
          })
      }
    },
    loadShow() {
      this.$parent.loading = true
    },
    loadCancel() {
      this.$parent.loading = false
    },
    loginWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth()
        .signInWithPopup(provider).then((result) => {
          this.$store.commit(constants.mutations.user, result.user)
          this.$store.commit(constants.mutations.loginStatus, true)
          this.$router.push(
            this.$route.query.redirect ? this.$route.query.redirect : constants.path.TOP
          )
        })
        .catch((error) => {
          let errorCode = error.code
          let errorMessage = error.message
          console.log(errorCode, errorMessage)
          alert('ログインに失敗しました')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;

main {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.icon {
  margin: 0 auto 15px;
  width: 96px;
  line-height: 0;
  img { width: 100%; height: auto; }
}
h1 { margin-bottom: 20px; text-align: center; }
.signin-wrap {
  padding: 50px 80px;
  width: 640px;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  background: #FFF;
  font-size: 16px;
  .btn-google {
    padding: .4em;
    border: 1px solid #CCC;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .3s;
    cursor: pointer;
    img { width: 30px; }
    p { margin-left: 1em; }
    &:hover { background: #EFEFEF; }
  }
  .separator {
    margin: 8px 0;
    display: flex;
    justify-content: center;
    overflow: hidden;
    p { position: relative; color: #888; letter-spacing: .1em;
      &:before, &:after {
        position: absolute;
        top: 50%;
        display: block;
        width: 480px;
        height: 1px;
        content: "";
        background: #888;
      }
      &:before { right: calc(100% + 1em); }
      &:after { left: calc(100% + 1em); }
    }
  }
  .row { margin-bottom: 8px; display: flex; align-items: center; }
  label { display: block; width: 30%; }
  input[type="email"],input[type="password"] {
    padding: .5em;
    border: 1px solid #CCC;
    border-radius: 5px;
    width: 70%;
    font-size: 20px;
    box-sizing: border-box;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    transition: .1s;
    &:focus {
      border-color: $primaryOrange;
      box-shadow: 0 0 5px 1px rgba(235, 122, 53, .5);
      outline: none;
    }
  }
  .btn-submit {
    margin: 0;
    padding: .9em;
    border: none;
    border-radius: 5px;
    outline: none;
    display: block;
    width: 100%;
    line-height: 1;
    color: #FFF;
    background: $primaryOrange;
    font-size: 16px;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    text-align: center;
    transition: .3s;
    &:before {
      margin-right: .5em;
      font-family: "Font Awesome 5 Free";
      content: '\f2f6';
      font-weight: 900;
    }
    &:hover { background: #dc7330; }
  }
  .form-signin { margin-top: 8px; }
}
</style>
