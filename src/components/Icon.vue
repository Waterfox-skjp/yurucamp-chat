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
              <li v-for="icon in iconList" :key="icon.index" @click="changeIcon(icon)" :class="{active: icon.imgPath == $store.state.iconData.imgPath}">
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
import constants from '@/constants'
import modalClose from '@/modalClose'

export default {
  name: 'Icon',
  mixins: [modalClose],
  data() {
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
  created:function(){
    this.listen(window, 'click', function(e){
      if (!this.$el.contains(e.target)){
        this.$parent.modalIcon = false
      }
    }.bind(this))
  },
  methods: {
    changeIcon(e) {
      this.$store.commit(constants.mutations.icon, e)
    }
  }
}
</script>

<style lang="scss">
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;
@keyframes scale-up-icon {
  0% { transform: translateX(-50%) scale(0); transform-origin: 14% 100%; }
  100% { transform: translateX(-50%) scale(1); transform-origin: 14% 100%; }
}

.icon-wrap { margin-right: 1.5%; position: relative; width: 5.5%;
  .btn-icon {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 40px;
    line-height: 1;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    img { width: 100%; transition: .3s; }
  }
  .modal-icon {
    padding-bottom: 30px;
    position: absolute;
    bottom: calc(100% + 30px);
    left: calc(50% + 144px);
    width: 400px;
    transform: translateX(-50%);
    &:before {
      position: absolute;
      left: 60px;
      bottom: 0;
      display: block;
      width: 50px;
      height: 30px;
      content: "";
      background: url(../assets/projection.svg) no-repeat center center;
      background-size: 100% auto;
    }
  }
  .fade-enter-active { animation: scale-up-icon 0.3s ease-out; }
  .fade-leave-active { animation: scale-up-icon 0.3s ease-out reverse ; }
  .fade-enter, .fade-leave-to { transform: translateX(-50%) scale(0); }
  .fukidashi-box {
    border-radius: 5px;
    overflow: hidden;
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
      ul { padding: 0 30px 30px; display: flex; flex-wrap: wrap; }
      li {
        padding: 8px;
        overflow: hidden;
        border: 2px solid transparent;
        border-radius: 5px;
        width: 32%;
        line-height: 1;
        text-align: center;
        cursor: pointer;
        transition: .3s;
        img { width: 100%; }
        &:not(:nth-child(3n)) { margin-right: 2%; }
        &:nth-child(n+4) { margin-top: 2%; }
        p { font-size: 12px; letter-spacing: -.08em; text-align: center;
          span { display: block; }
        }
        &.active { border-color: $primaryOrange; background: #eb7b3513; }
      }
    }
  }
}
</style>
