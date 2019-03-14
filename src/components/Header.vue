<template>
  <header>
    <div class="logo">
      <router-link :to='topPath' >
        <img src="../assets/logo.svg" alt="ゆるキャン△風 チャット">
      </router-link>
    </div>
    <template v-if="loginStatus">
      <div class="nav-wrap">
        <div class="icon" @click="modalNav = !modalNav">
          <img :src="user.photoURL | displayIconSet" alt="アイコン">
        </div>
        <transition name="nav">
          <nav v-if="modalNav">
            <ul class="test">
              <li class="status">
                <img :src="user.photoURL | displayIconSet" alt="アイコン" class="display-icon">
                <div class="detail">
                  <p class="name">{{ user.displayName }} <span>さん</span></p>
                  <p class="adress">{{ user.email }}</p>
                </div>
                </li>
              <li class="setting" @click="openModal()">設定</li>
              <li class="logout" @click="logout()">ログアウト</li>
            </ul>
          </nav>
        </transition>
      </div>
    </template>
  </header>
</template>

<script>
import firebase from 'firebase/app'
import modalClose from '@/modalClose'
import constants from '@/constants'

export default {
  name: 'Header',
  mixins: [modalClose],
  data() {
    return {
      modalNav: false
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loginStatus
    },
    user() {
      return this.$store.state.user
    },
    topPath() {
      return { path: constants.path.TOP }
    }
  },
  created:function(){
    this.listen(window, 'click', function(e){
      const nav = document.querySelector('.nav-wrap')
      if (!nav.contains(e.target)){
        this.modalNav = false
      }
    }.bind(this))
  },
  methods: {
    logout() {
      this.$parent.loading = false
      firebase.auth().signOut()
      .then(() => {
        this.$router.push('/')
        window.location.reload() // 保持してた不要な情報を一度クリア(vuexはきえない)
      })
      .catch((error) => {
        const errorMessage = error.message
        alert(errorMessage)
      })
    },
    openModal() {
      this.$parent.modalSetting = !this.$parent.modalSetting
      this.modalNav = false
    }
  },
  filters: {
    displayIconSet(x) {
      if(x == null) {
        x = '/img/default-display-icon.png'
      }
      return x
    }
  }
}
</script>

<style lang="scss" scoped>
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;

@keyframes slide-down {
  0% { transform: translateY(-30px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

header {
  padding: 9px 45px 9px 30px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 8888;
  width: 100%;
  height: 50px;
  color: #FFF;
  background: $primaryBlue;
  .logo {
    a { display: block; height: 100%; line-height: 0; }
    img { height: 100%; }
  }
  .nav-wrap { position: relative;
    nav {
      position: absolute;
      top: calc(100% + 15px);
      right: 0;
      z-index: 7777;
      border-radius: 5px;
      box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      width: 300px;
      color: #333;
      background: #FEFEFE;
      font-size: 16px;
      li { padding: .5em 1em; transition: .3s;
        &.status {
          display: flex;
          align-items: center;
          .display-icon { border-radius: 50%; overflow: hidden; width: 64px; }
          .detail { margin-left: 10px;
            .name {
              span { font-size: 12px; }
            }
            .adress { color: #999; font-size: 12px; }
          }
        }
        &.setting, &.logout { cursor: pointer;
          &:hover { background: #EEE; }
          &:before { margin-right: .5em; color: #888; font-family: "Font Awesome 5 Free"; font-weight: 900; }
        }
        &.setting:before { content: "\f013"; }
        &.logout:before { content: "\f2f5"; }
        &:not(:last-child) { border-bottom: 1px solid #EEE; }
      }
    }
    .icon {
      display: flex;
      align-items: center;
      cursor: pointer;
      line-height: 0;
      &:after {
        margin-left: .5em;
        font-family: "Font Awesome 5 Free";
        content: '\f0d7';
        font-size: 20px;
        font-weight: 900;
      }
      img {
        border-radius: 50%;
        overflow: hidden;
        width: 32px;
        height: auto;
      }
    }
  .nav-enter-active { animation: slide-down 0.2s ease-out; }
  .nav-leave-active { animation: slide-down 0.2s ease-out reverse; }
  .nav-enter-to, .nav-leave { transform: translateY(0); opacity: 1; }
  .nav-enter, .nav-leave-to { transform: translateY(-30px); opacity: 0; }
  }
}
</style>
