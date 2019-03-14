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
        <div class="row handle-name">
          <label for="inputHandleName">ハンドルネーム：</label>
          <input
            type="text"
            id="inputHandleName"
            v-model="userInfo.displayName"
          >
        </div>
        <div class="row">
          <button type="submit" class="btn-submit">新規登録する</button>
        </div>
      </form>
      <div>
        <router-link :to='loginPath'>ログイン画面へ</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import firebase from 'firebase/app'
import constants from '@/constants'

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
    loginPath() {
      return { path: constants.path.SIGN_IN }
    }
  },
  methods: {
    signUp() {
      this.loadShow()
      if(this.userInfo.userid == null || this.userInfo.password == null || this.userInfo.displayName == null) {
        this.loadCancel()
        alert('メールアドレス、パスワード、ハンドルネームを入力してください')
      }else {
        firebase.auth()
          .createUserWithEmailAndPassword(
            this.userInfo.userid,
            this.userInfo.password
          )
          .then(result => {
            this.$store.commit(constants.mutations.user, result.user)
            this.$store.commit(constants.mutations.loginStatus, true)
            result.user
              .updateProfile({
                displayName: this.userInfo.displayName
              })
              .then(() => {
                this.userInfo.password = ''
                localStorage.removeItem('userInfo')
                this.$router.push(
                  this.$route.query.redirect ? this.$route.query.redirect : constants.path.TOP
                )
              })
          })
          .catch((error) => {
            const errorCode = error.code
            // const errorMessage = error.message
            // alert(errorCode + '\n' + errorMessage)
            this.loadCancel()
            if(errorCode == 'auth/email-already-in-use') {
              alert(`このメールアドレスは既に登録されています`)
            } else if(errorCode == 'auth/invalid-email') {
              alert('このパスワードは無効です')
            } else if(errorCode == 'auth/weak-password') {
              alert('パスワード強度が不十分です')
            }
          })
      }
    },
    loadShow() {
      this.$parent.loading = true
    },
    loadCancel() {
      this.$parent.loading = false
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
.signup-wrap {
  padding: 50px 80px;
  width: 640px;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  background: #FFF;
  font-size: 16px;
  .row { margin-bottom: 8px; display: flex; align-items: center;
    &.handle-name { margin-top: 16px; }
  }
  label { display: block; width: 30%; }
  input[type="email"],input[type="password"],input[type="text"] {
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
      content: '\f055';
      font-weight: 900;
    }
    &:hover { background: #dc7330; }
  }
}
</style>
