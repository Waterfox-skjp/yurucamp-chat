<template>
  <div class="icon-wrap">
    <div class="btn-icon" @click="$parent.modalIcon = !$parent.modalIcon">
      <img :src="'/img/icon/' + $store.state.iconData.imgPath + '.png'" :alt="$store.state.iconData.name">
    </div>
    <transition name="fade">
      <div v-if="$parent.modalIcon" class="modal-icon">
        <div class="fukidashi-box">
          <div class="head">
            <div class="btn-close" @click="$parent.modalIcon = false"></div>
          </div>
          <div class="scroll-area">
            <ul>
              <li v-for="icon in iconList" :key="icon.index" :class="{active: icon.imgPath == $store.state.iconData.imgPath}" @click="changeIcon(icon)">
                <img :src="'/img/icon/' + icon.imgPath + '.png'" :alt="icon.name">
                <p>{{ icon.name }}<span>({{ icon.version }})</span></p>
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
  name: 'Icon',
  mixins: [modalClose],
  data () {
    return {
      iconList: [
        {
          imgPath: 'kagamihara-default',
          name: '各務原なでしこ',
          version: 'デフォルト'
        },
        {
          imgPath: 'shima-default',
          name: '志摩リン',
          version: 'デフォルト'
        },
        {
          imgPath: 'ogaki-default',
          name: '大垣千明',
          version: 'デフォルト'
        },
        {
          imgPath: 'inuyama-default',
          name: '犬山あおい',
          version: 'デフォルト'
        },
        {
          imgPath: 'saito-default',
          name: '斉藤恵那',
          version: 'デフォルト'
        }
      ]
    }
  },
  created () {
    this.listen(window, 'click', function (e) {
      if (!this.$el.contains(e.target)) {
        this.$parent.modalIcon = false
      }
    }.bind(this))
  },
  methods: {
    changeIcon (e) {
      this.$store.commit('iconData', e)
    }
  }
}
</script>
