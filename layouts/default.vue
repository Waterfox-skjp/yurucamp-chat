<template>
  <div id="app">
    <div id="container" :class="{ header: this.$route.path == '/'}">
      <template v-if="this.$route.path == '/'">
        <Header />
      </template>
      <nuxt />
    </div>
    <transition name="setting">
      <div v-if="modalSetting == true" class="modal-setting" @click.self="modalSetting = false">
        <Setting />
      </div>
    </transition>
    <transition name="loading">
      <div v-if="loading" class="loading-area">
        <div class="loading-inner">
          <div class="loader"></div>
          <p>Now Loading...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Setting from '~/components/Setting.vue'

export default {
  name: 'App',
  components: {
    Header,
    Setting
  },
  data () {
    return {
      modalSetting: false,
      loading: false
    }
  },
  watch: {
    '$route' (to) {
      this.createPageTitle(to)
      this.loading = false
    }
  },
  mounted () {
    const to = this.$route
    this.createPageTitle(to)
  },
  methods: {
    createPageTitle (to) {
      // タイトルを設定
      if (to.meta.title) {
        const setTitle = to.meta.title + ' | ゆるキャン△風 チャット'
        document.title = setTitle
      } else {
        document.title = 'ゆるキャン△風 チャット'
      }
    }
  }
}
</script>
