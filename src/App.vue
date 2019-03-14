<template>
  <div id="app">
    <div id="container" :class="{ header: this.$route.path == '/'}">
      <template v-if="this.$route.path == '/'">
        <Header />
      </template>
      <router-view/>
    </div>
    <transition name="setting">
      <div class="modal-setting" v-if="modalSetting == true" @click.self="modalSetting = false">
        <Setting />
      </div>
    </transition>
    <transition name="loading">
      <div class="loading-area" v-if="loading">
        <div class="loading-inner">
          <div class="loader"></div>
          <p>Now Loading...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Setting from '@/components/Setting'

export default {
  name: 'App',
  components: {
    Header,
    Setting
  },
  data() {
    return {
      modalSetting: false,
      loading: false
    }
  },
  mounted: function() {
    var to = this.$route
    this.createPageTitle(to)
  },
  watch: { 
    '$route' (to) {
      this.createPageTitle(to)
      this.loading = false
    }
  },
  methods: {
    createPageTitle(to) {
      // タイトルを設定
      if(to.meta.title){
        var setTitle = to.meta.title + ' | ゆるキャン△風 チャット'
        document.title = setTitle
      } else {
        document.title = 'ゆるキャン△風 チャット'
      }
    }
  }
}
</script>

<style lang="scss">
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;

html, body, header, main, aside, footer, section, article, nav,
h1, h2, h3, h4, h5, h6,
table, caption, tbody, tfoot, thead, tr, th, td, form,
figcaption, figure, button,
div, ul, ol, li, dl, dt, dd, p, a, span,
small, strong, sub, sup {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
header, main, aside, footer, section, article { display: block; }
h1, h2, h3, h4, h5, h6 {
	line-height: 1;
	font-weight: normal;
}
body {
  font-family:"游ゴシック Medium",YuGothic,YuGothicM,"Hiragino Kaku Gothic ProN","Hiragino Kaku Gothic Pro",メイリオ,Meiryo,sans-serif;
  font-size: 62.5%;
  color: #333;
  min-width: 1015px;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
th, td { text-align: left; }
ul, ol, li { list-style: none; }
a { color: $primaryOrange; text-decoration: none; }
#container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: url(./assets/bg-main.png) no-repeat center center;
  background-size: cover;
  &.header { padding-top: 50px; }
}
.inner { margin: 0 auto; width: 1000px; }
.modal-setting {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.3);
}
.setting-enter-active, .setting-leave-active { transition: opacity .3s; }
.setting-enter, .setting-leave-to { opacity: 0; }
.loading-area {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9990;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.5);
  .loading-inner { text-align: center;
    p { color: #FFF; font-size: 16px; font-weight: bold; }
    .loader,
    .loader:after {
      border-radius: 50%;
      width: 100px;
      height: 100px;
    }
    .loader {
      display: inline-block;
      font-size: 10px;
      position: relative;
      text-indent: -9999em;
      border-top: 1.1em solid rgba(235, 122, 53, .2);
      border-right: 1.1em solid rgba(235, 122, 53, .2);
      border-bottom: 1.1em solid rgba(235, 122, 53, .2);
      border-left: 1.1em solid $primaryOrange;
      transform: translateZ(0);
      animation: load 1.1s infinite linear;
    }
    @keyframes load {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
}
</style>
