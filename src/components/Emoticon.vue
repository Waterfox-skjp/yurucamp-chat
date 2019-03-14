<template>
  <div class="emoticon-wrap">
    <div class="btn-emoticon" @click="$parent.modalEmoticon = !$parent.modalEmoticon" :class="{open: $parent.modalEmoticon}">(・∀・)</div>
    <transition name="fade">
      <div v-if="$parent.modalEmoticon" class="modal-emoticon">
        <div class="fukidashi-box">
          <div class="head">
            <div class="btn-close" @click="$parent.modalEmoticon = false"></div>
          </div>
          <div class="scroll-area">
            <ul>
              <li v-for="emoticon in emoticonList" :key="emoticon.index" @click="addEmoticon(emoticon)">{{ emoticon }}</li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import modalClose from '@/modalClose'

export default {
  name: 'Emoticon',
  mixins: [modalClose],
  data() {
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
  created:function(){
    this.listen(window, 'click', function(e){
      if (!this.$el.contains(e.target)){
        this.$parent.modalEmoticon = false
      }
    }.bind(this))
  },
  methods: {
    addEmoticon(item) {
      this.$parent.text += item
      this.$parent.modalEmoticon = false
    }
  }
}
</script>

<style lang="scss">
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;
@keyframes scale-up-emoticon {
  0% { transform: translateX(-50%) scale(0); transform-origin: 50% 100%; }
  100% { transform: translateX(-50%) scale(1); transform-origin: 50% 100%; }
}

.emoticon-wrap { margin-right: 1.5%; position: relative; width: 9%;
  .btn-emoticon {
    padding: .7em;
    border-radius: 5px;
    line-height: 1;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    transition: .3s;
    &:hover,&.open { background: rgba(0,0,0,.1); }
  }
  .modal-emoticon {
    padding-bottom: 30px;
    position: absolute;
    bottom: calc(100% + 32px);
    left: calc(50% + 2px);
    width: 400px;
    transform: translateX(-50%);
    &:before {
      position: absolute;
      right: 150px;
      bottom: 0;
      display: block;
      width: 50px;
      height: 30px;
      content: "";
      background: url(../assets/projection.svg) no-repeat center center;
      background-size: 100% auto;
    }
  }
  .fade-enter-active { animation: scale-up-emoticon 0.3s ease-out; }
  .fade-leave-active { animation: scale-up-emoticon 0.3s ease-out reverse; }
  .fade-enter, .fade-leave-to { transform: translateX(-50%) scale(0); }
  .fukidashi-box {
    border-radius: 5px;
    overflow: hidden;
    border-radius: 5px;
    height: 220px;
    background: #FFF;
    font-size: 16px;
    .head { padding: 10px; height: 40px;
      .btn-close { line-height: .8; float: right; cursor: pointer;
        &:before {
          content: "\f00d";
          color: #888;
          font-family: "Font Awesome 5 Free";
          font-size: 28px;
          font-weight: 900;
        }
      }
    }
    .scroll-area { overflow-y: scroll; height: calc(100% - 40px);
      ul { padding: 0 30px 30px; font-size: 0; }
      li {
        padding: .7em .5em;
        border-radius: 5px;
        display: inline-block;
        font-size: 16px;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        transition: .3s;
        &:hover { background: rgba(0,0,0,.1); }
      }
    }
  }
}
</style>