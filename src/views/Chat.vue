<template>
  <main>
    <div class="bg-chat" :style="{ backgroundImage: `url('${bgImage}')` }"></div>
    <div class="chat-area">
      <div class="output-area" ref="scrollHeight">
        <div class="inner" ref="innerHeight">
          <ul :class="{loaded: postsLoad}">
            <li v-for="post in posts" :key='post.index' :class="{self: post.user == $store.state.user.uid }">
              <div class="icon-area">
                <img :src="'/img/icon/' + post.icon.imgPath + '.png'" :alt="post.icon.name">
              </div>
              <p class="name">{{ post.name }}</p>
              <div class="text-area">
                <nl2br tag="p" :text="post.text"/>
              </div>
              <div class="time-area">{{ post.date.seconds | timestamp }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="input-area">
        <div class="inner">
          <div class="inner-box">
            <Icon />
            <textarea class="text-area" v-model="text" rows="7" cols="60" placeholder="Alt + Enter で送信" @keyup.alt.enter="submit"></textarea>
            <Emoticon />
            <button class="btn-submit" @click="submit">送信する</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { db } from '@/main'
import Icon from '@/components/Icon'
import Emoticon from '@/components/Emoticon'
import Nl2br from 'vue-nl2br'
import dayjs from 'dayjs'

export default {
  name: 'Chat',
  components: {
    Nl2br,
    Icon,
    Emoticon
  },
  data() {
    return {
      text: '',
      posts: [],
      postsLoad: false,
      unsubscribe: null,
      modalIcon: false,
      modalEmoticon: false,
      height: window.innerHeight
    }
  },
  computed: {
    bgImage () {
      return this.$store.state.bgImage
    }
  },
  created() {
    this.unsubscribe = db.collection('room1').orderBy('date').onSnapshot(
      ss => {
        let w = []
        ss.forEach( doc => w.push( doc.data() ) )
        this.posts = w
        this.postsLoad = true
      })
    window.addEventListener('resize', this.handleResize, false)
  },
  watch: {
    posts() {
      this.$nextTick(function () {
        var innerHeight = this.$refs.innerHeight.offsetHeight
        const scrollHeight = this.$refs.scrollHeight
        scrollHeight.scrollTo(0, innerHeight)
        window.scrollTo(0, this.height)
      })
    }
  },
  methods: {
    submit() {
      const nowtime = new Date()
      if ( !this.text ) return
      db.collection('room1').add({
        text: this.text,
        date: nowtime,
        name: this.$store.state.user.displayName,
        user: this.$store.state.user.uid,
        icon: this.$store.state.iconData
        }).then(
        () => this.text = ''
      ).catch( e => alert( e ) )
    },
    handleResize() {
      this.height = window.innerHeight
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize, false)
    this.unsubscribe()
  },
  filters: {
    timestamp: function(y) {
      y = y * 1000
      y = dayjs(y).format('YYYY/MM/DD HH:mm')
      return y
    }
  }
}
</script>

<style lang="scss" scoped>
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;

@font-face {
  font-family: 'Kosugi Maru';
  font-style: normal;
  font-weight: 400;
  src: url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.eot'); /* IE9 Compat Modes */
  src: local('Kosugi Maru'), local('KosugiMaru-Regular'),
       url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.woff') format('woff'), /* Modern Browsers */
       url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../assets/fonts/kosugi-maru-v3-latin_japanese-regular.svg#KosugiMaru') format('svg'); /* Legacy iOS */
}

@keyframes scale-up-center {
  0% { transform: scale(0); transform-origin: 50% 100%; }
  100% { transform: scale(1); transform-origin: 50% 100%; }
}
@keyframes slide-down {
  0% { transform: translateY(-100%); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
@keyframes scale-up-bl {
  0% { transform: scale(0); transform-origin: 0% 100%; }
  100% { transform: scale(1); transform-origin: 0% 100%; }
}
@keyframes scale-up-br {
  0% { transform: scale(0.5); transform-origin: 100% 100%; }
  100% { transform: scale(1); transform-origin: 100% 100%; }
}
@keyframes slide-right {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
@keyframes slide-left {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

//ピクセルをパーセントで出力
@function px($size,$width:640){
	$rate: $size / 640*(640/$width);
	@return $rate * 100 * 1%;
}

//640px時点でのvminを計算
$viewport:640;
@function get_vmin($size, $viewport:$viewport){
	$rate: 100 / $viewport;
	@return $rate * $size * 1vmin;
}

//vminでのフォントサイズを出力
@mixin vmin($font_size:10){
	font-size: $font_size * 1px*$viewport/640;
	font-size: $font_size / 10 * 1rem*$viewport/640;
	font-size: get_vmin($font_size)*$viewport/640;
}

main {
  margin: auto 0 0;
  padding-bottom: 30px;
  min-width: 1015px;
  height: 100%;
  overflow: hidden;
}
.bg-chat {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-size: cover;
  transition: background-image .3s;
}
.chat-area {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  .output-area { overflow-y: scroll; height: 100%; -webkit-overflow-scrolling: touch;
    .inner { width: 100%; max-width: 1000px; }
    ul { padding: 30px 0;
      &.loaded li {
        .icon-area { animation: scale-up-center 0.1s ease-in-out; }
        .name { animation: slide-down 0.1s ease-in-out; }
        .text-area { animation: scale-up-bl 0.1s ease-in-out; }
        .time-area { animation: slide-right 0.1s ease-in-out; }
        &.self {
          .text-area { animation: scale-up-br 0.1s ease-in-out; }
          .time-area { animation: slide-left 0.1s ease-in-out; }
        }
      }
    }
    li {
      padding-bottom: 22px;
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      .icon-area {
        margin-right: 20px;
        width: 68px;
        height: 71px;
        line-height: 0;
        img { width: 100%; }
      }
      .text-area { max-width: 500px; padding-left: 16px;
        p {
          padding: .45em .8em;
          position: relative;
          border: 2px solid #FFF;
          border-left: none;
          border-radius: 5px;
          line-height: 1.3;
          color: #000;
          background: rgba(255,255,255,.5);
          font-family: 'Kosugi Maru',"ヒラギノ丸ゴ Pro W4","ヒラギノ丸ゴ Pro","Hiragino Maru Gothic Pro","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro","HG丸ｺﾞｼｯｸM-PRO","HGMaruGothicMPRO";
          font-size: 20px;
          letter-spacing: .15em;
          text-shadow: 
          #FFF 1px 1px 0, #FFF -1px -1px 0,
          #FFF -1px 1px 0, #FFF 1px -1px 0,
          #FFF 0px 1px 0, #FFF  0 -1px 0,
          #FFF -1px 0 0, #FFF 1px 0 0;
          &:before {
            position: absolute;
            bottom: 1px;
            left: -14px;
            display: block;
            width: 16px;
            height: 15px;
            content: "";
            background: url(../assets/fukidashi-haji.svg) no-repeat;
            background-size: 100% auto;
          }
          &:after {
            position: absolute;
            top: 1px;
            left: 0;
            display: block;
            width: 2px;
            height: calc(100% - 15px);
            content: "";
            background: #FFF;
          }
        }
      }
      .time-area { margin-left: 20px; font-size: 12px; }
      .name { position: absolute; left: 0; bottom: 0; font-size: 14px; }
      &.self { justify-content: flex-end;
        .icon-area { margin-right: 0; margin-left: 20px; order: 3;
          img { transform: scale(-1, 1); }
        }
        .time-area { order: -1; }
        .text-area { padding-left: 0; padding-right: 16px;
          p { border-left: 2px solid #FFF; border-right: none;
            &:after { right: 0; left: auto; }
            &:before { right: -14px; left: auto; transform: scale(-1, 1); }
          }
        }
        .time-area { margin-right: 20px; margin-left: 0; }
        .name { left: auto; right: 0; }
      }
      &:not(:last-child) { margin-bottom: 8px; }
    }
  }
  .input-area { padding-right: 15px;
    .inner-box {
      padding: 30px;
      border-radius: 5px;
      background: #FFF;
      display: flex;
      align-items: flex-end;
      .text-area {
        margin-right: 1.5%;
        padding: .5em;
        width: 66.5%;
        height: 1em;
        font-size: 18px;
        border: 1px solid #CCC;
        transition: .1s;
        &:focus {
          border-color: $primaryOrange;
          box-shadow: 0 0 5px 1px rgba(235, 122, 53, .5);
          outline: none;
        }
      }
      .btn-submit {
        padding: .7em;
        border: none;
        border-radius: 5px;
        outline: none;
        display: block;
        cursor: pointer;
        appearance: none;
        width: 12%;
        line-height: 1;
        color: #FFF;
        background: $primaryOrange;
        font-size: 16px;
        transition: .3s;
        &:before {
          margin-right: .5em;
          font-family: "Font Awesome 5 Free";
          content: '\f1d8';
          font-weight: 900;
        }
        &:hover { background: #dc7330; }
      }
    }
  }
}
@media screen and (max-width: 640px) {
  main {
    padding-bottom: px(115);
    min-width: 0;
    background-attachment: fixed;
  }
  .chat-area { display: block;
    .output-area { overflow-y: visible;
      ul { padding: px(30); }
      li { padding-bottom: 4.6vmin;
        .icon-area {
          margin-right: 2%;
          display: flex;
          align-items: flex-end;
          width: 13%;
          height: 10vmin;
        }
        .text-area { max-width: 63%; width: auto; padding-left: 3vmin;
          p {
            border: 1px solid #FFF;
            border-left: none;
            border-radius: 1vmin;
            @include vmin(26);
            &:before {
              left: -3.05vmin;
              width: calc(3vmin + 1px);
              height: 3vmin;
              background: url(../assets/fukidashi-haji-min.svg) no-repeat;
              background-size: 100% auto;
            }
            &:after { width: 1px; height: calc(100% - 3vmin); }
          }
        }
        .time-area {
          margin-left: 2%;
          width: 20%;
          line-height: 1.2;
          @include vmin(20);
        }
        .name { @include vmin(20); }
        &.self {
          .icon-area { margin-left: 2%; }
          .text-area { padding-right: 3vmin;
            p { border-left: 1px solid #FFF; border-right: none;
              &:before { right: -3.05vmin; }
            }
          }
          .time-area { margin-right: 2%; text-align: right; }
        }
        &:not(:last-child) { margin-bottom: px(10,580); }
      }
    }
    .input-area { padding: 0; position: fixed; bottom: 0; left: 0; width: 100%;
      .inner-box { padding: px(30); border-radius: 0;
        .text-area { width: 73%; @include vmin(26); }
        .btn-submit {
          padding: px(18) 0;
          border-radius: 1vmin;
          width: 12%;
          font-size: 0;
          &:before { margin-right: 0; @include vmin(24); }
        }
      }
    }
  }
  @media (orientation: landscape){
    main { padding-bottom: px(66); }
    .chat-area {
      .output-area {
        ul { padding: px(15); }
        li { padding-bottom: 4vmin;
          .icon-area { width: 7.5%; height: 9vmin; }
          .text-area { max-width: 68.5%; }
          &:not(:last-child) { margin-bottom: px(20,580); }
        }
      }
      .input-area {
        .inner-box { padding: px(17) px(15);
          .text-area { width: 75%; }
          .btn-submit { padding: px(9.5) 0; }
        }
      }
    }
  }
}
</style>
