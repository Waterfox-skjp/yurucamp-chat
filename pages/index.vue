<template>
  <main>
    <div class="bg-chat" :style="{ backgroundImage: `url('${bgImage}')` }"></div>
    <div class="chat-area">
      <div ref="scrollHeight" class="output-area">
        <div ref="innerHeight" class="inner">
          <ul :class="{loaded: postsLoad}">
            <li v-for="post in posts" :key="post.index" :class="{self: post.user == $store.state.user.uid }">
              <div class="icon-area">
                <img :src="'/img/icon/' + post.icon.imgPath + '.png'" :alt="post.icon.name">
              </div>
              <p class="name">
                {{ post.name }}
              </p>
              <div class="text-area">
                <nl2br tag="p" :text="post.text" />
              </div>
              <div class="time-area">
                {{ post.date.seconds | timestamp }}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="input-area">
        <div class="inner">
          <div class="inner-box">
            <Icon />
            <textarea
              v-model="text"
              class="text-area"
              rows="7"
              cols="60"
              placeholder="Alt + Enter で送信"
              @keyup.alt.enter="submit"
            ></textarea>
            <Emoticon />
            <button class="btn-submit" @click="submit">
              送信する
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Nl2br from 'vue-nl2br'
import dayjs from 'dayjs'
import Icon from '~/components/Icon'
import Emoticon from '~/components/Emoticon'
import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()

export default {
  name: 'Chat',
  components: {
    Nl2br,
    Icon,
    Emoticon
  },
  filters: {
    timestamp (y) {
      y = y * 1000
      y = dayjs(y).format('YYYY/MM/DD HH:mm')
      return y
    }
  },
  data () {
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
  watch: {
    posts () {
      this.$nextTick(function () {
        const innerHeight = this.$refs.innerHeight.offsetHeight
        const scrollHeight = this.$refs.scrollHeight
        scrollHeight.scrollTo(0, innerHeight)
        window.scrollTo(0, this.height)
      })
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize, false)
  },
  created () {
    this.unsubscribe = db.collection('room1').orderBy('date').onSnapshot(
      (ss) => {
        const w = []
        ss.forEach(doc => w.push(doc.data()))
        this.posts = w
        this.postsLoad = true
      })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize, false)
    this.unsubscribe()
  },
  methods: {
    submit () {
      const nowtime = new Date()
      if (!this.text) { return }
      db.collection('room1').add({
        text: this.text,
        date: nowtime,
        name: this.$store.state.user.displayName,
        user: this.$store.state.user.uid,
        icon: this.$store.state.iconData
      }).then(this.text = '').catch(e => alert(e))
    },
    handleResize () {
      this.height = window.innerHeight
    }
  }
}
</script>
