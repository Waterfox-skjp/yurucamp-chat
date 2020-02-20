<template>
  <div class="emoticon-wrap">
    <div class="btn-emoticon" :class="{open: $parent.modalEmoticon}" @click="$parent.modalEmoticon = !$parent.modalEmoticon">
      (・∀・)
    </div>
    <transition name="fade">
      <div v-if="$parent.modalEmoticon" class="modal-emoticon">
        <div class="fukidashi-box">
          <div class="head">
            <div class="btn-close" @click="$parent.modalEmoticon = false"></div>
          </div>
          <div class="scroll-area">
            <ul>
              <li v-for="emoticon in emoticonList" :key="emoticon.index" @click="addEmoticon(emoticon)">
                {{ emoticon }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import modalClose from '~/plugins/modalClose.js'

export default {
  name: 'Emoticon',
  mixins: [modalClose],
  data () {
    return {
      emoticonList: [
        '(´ェ`)？',
        '(*´ェ`)b',
        '(*´ェ`)ノシ',
        '(*´ェ`*)',
        '(*´w`*)',
        '(*◎o◎*)',
        '(*´v`*)',
        '(｀ﾟωﾟ´)ゞ',
        '(´；ω；｀)',
        '(｀＞v＜´)ゞ',
        '＼(*ﾟ∀ﾟ*)ノシ',
        '( ﾟ H ﾟ )',
        '(°∀｡三｡∀°)',
        '(<◉>◞౪◟<◉>)',
        '☝(◔◞౪◟◔)☝',
        '(＞ε＜)／',
        '(＞H＜)',
        '(*´v`) _旦~',
        '(*´ワ`*)',
        '(｀･ω･´)ゞ',
        '(´ー`*)',
        '＼(*´ワ`*)／',
        '(？w？)',
        '(´v`；)',
        '(´；ω；｀)'
      ]
    }
  },
  created () {
    this.listen(window, 'click', function (e) {
      if (!this.$el.contains(e.target)) {
        this.$parent.modalEmoticon = false
      }
    }.bind(this))
  },
  methods: {
    addEmoticon (item) {
      this.$parent.text += item
      this.$parent.modalEmoticon = false
    }
  }
}
</script>
