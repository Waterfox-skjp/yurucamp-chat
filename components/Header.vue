<template>
  <header>
    <div class="logo">
      <router-link :to="topPath">
        <img src="../assets/logo.svg" alt="ゆるキャン△風 チャット">
      </router-link>
    </div>
    <template v-if="loginStatus">
      <div ref="navWrap" class="nav-wrap">
        <div class="icon" @click="modalNav = !modalNav">
          <img :src="user.photoURL | displayIconSet" alt="アイコン">
        </div>
        <transition name="nav">
          <nav v-if="modalNav">
            <ul class="test">
              <li class="status">
                <img :src="user.photoURL | displayIconSet" alt="アイコン" class="display-icon">
                <div class="detail">
                  <p class="name">
                    {{ user.displayName }} <span>さん</span>
                  </p>
                  <p class="adress">
                    {{ user.email }}
                  </p>
                </div>
              </li>
              <li class="setting" @click="openModal()">
                設定
              </li>
              <li class="logout" @click="logout()">
                ログアウト
              </li>
            </ul>
          </nav>
        </transition>
      </div>
    </template>
  </header>
</template>

<script>
import firebase from '~/plugins/firebase.js'
import modalClose from '~/plugins/modalClose.js'

export default {
  name: 'Header',
  filters: {
    displayIconSet (x) {
      if (x == null) {
        x = '/img/default-display-icon.png'
      }
      return x
    }
  },
  mixins: [modalClose],
  data () {
    return {
      modalNav: false
    }
  },
  computed: {
    loginStatus () {
      return this.$store.state.loginStatus
    },
    user () {
      return this.$store.state.user
    },
    topPath () {
      return { path: '/' }
    }
  },
  created () {
    this.listen(window, 'click', function (e) {
      const nav = this.$refs.navWrap
      if (!nav.contains(e.target)) {
        this.modalNav = false
      }
    }.bind(this))
  },
  methods: {
    logout () {
      this.$parent.loading = false
      firebase.auth().signOut()
        .then(() => {
          this.$router.push('/signin')
          window.location.reload() // 保持してた不要な情報を一度クリア(vuexはきえない)
        })
        .catch((error) => {
          const errorMessage = error.message
          alert(errorMessage)
        })
    },
    openModal () {
      this.$parent.modalSetting = !this.$parent.modalSetting
      this.modalNav = false
    }
  }
}
</script>
