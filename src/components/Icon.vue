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

.icon-wrap { margin-right: 1.5%; position: relative; width: 5.5%;
  .btn-icon {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 40px;
    line-height: 0;
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
    background: #FFF;
    .head { padding: 10px; display: flex; justify-content: flex-end;
      .btn-close { line-height: .8; cursor: pointer;
        &:before {
          content: "\f00d";
          color: #888;
          font-family: "Font Awesome 5 Free";
          font-size: 28px;
          font-weight: 900;
        }
      }
    }
    .scroll-area { overflow-y: scroll; height: 180px;
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
@media screen and (max-width: 640px) {
  @keyframes scale-up-icon {
    0% { transform: translateX(0) scale(0); transform-origin: 0% 100%; }
    100% { transform: translateX(0) scale(1); transform-origin: 0% 100%; }
  }
  .icon-wrap { margin-right: 1.5%; width: 12%;
    .btn-icon { height: 8.6vmin; cursor: pointer;
      img { width: 100%; transition: .3s; }
    }
    .modal-icon {
      padding-bottom: 45%;
      bottom: 155%;
      left: 0;
      width: px(580,66);
      transform: translateX(0);
      &:before { left: 5%; width: 7.9vmin; height: 4.7vmin; }
    }
    .fukidashi-box { border-radius: 1vmin;
      .head { padding: px(20,580);
        .btn-close {
          &:before { @include vmin(48); }
        }
      }
      .scroll-area { overflow-y: scroll; height: 48vmin;
        ul { padding: 0 px(30,580) px(30,580); }
        li { padding: px(3,167); border: 1px solid transparent; border-radius: 1vmin;
          p { @include vmin(20); }
        }
      }
    }
  }
  @media (orientation: landscape){
    .icon-wrap { width: 7.5%;
      .modal-icon { padding-bottom: 37%; width: px(480,40);
        .fukidashi-box {
          .head { padding: px(10,480) }
          .scroll-area { height: 40vmin;
            ul { padding: 0 px(15,480) px(15,480); }
            li {
              width: 18.4%;
              &:not(:nth-child(3n)) { margin-right: 0; }
              &:nth-child(n+4) { margin-top: 0; }
              &:not(:nth-child(5n)) { margin-right: 2%; }
              &:nth-child(n+6) { margin-top: 2%; }
            }
          }
        }
      }
    }
  }
}
</style>
