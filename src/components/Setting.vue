<template>
  <div class="modal-box">
    <div class="head">
      <h2>設定</h2>
      <div class="close" @click="$parent.modalSetting = false"></div>
    </div>
    <div class="tab">
      <ul class="tab-head">
        <li @click="tabActive = 1" :class="{'active': tabActive === 1}">壁紙</li>
        <li @click="tabActive = 2" :class="{'active': tabActive === 2}">音</li>
        <li @click="tabActive = 3" :class="{'active': tabActive === 3}">運営</li>
      </ul>
      <ul class="tab-contents">
        <li v-if="tabActive === 1">
          <ul class="bg-img-list">
            <li v-for="item in imgList" :key="item.index" @click="changeBg(item.url)" :class="{active: item.url == bgImage}">
              <img :src="item.url" alt="壁紙">
            </li>
          </ul>
          <div class="upload-area">
            <input
              type="file"
              ref="image"
              accept="image/*"
              @change="onFilePicked"
            />
            <div class="btn-wrap">
              <div class="btn-upload" @click="upload">アップロード</div>
              <div class="log-area">{{ logComment }}</div>
            </div>
          </div>
        </li>
        <li v-else-if="tabActive === 2">
          <p>開発中です。</p>
        </li>
        <li v-else-if="tabActive === 3">
          <p>本サービスは、水狐（<a href="https://twitter.com/Waterfox_skjp" target="_blank">@Waterfox_skjp</a>）が運営するサービスです。 ご不明点、ご依頼など何かございましたら、Twitterアカウントのリプライ・DM等でお気軽にご連絡・ご相談下さい。</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { db } from '../main'
import constants from '@/constants'

export default {
  name: 'Setting',
  data() {
    return {
      tabActive: 1,
      imageName: '',
      imageUrl: '',
      imageFile: '',
      imgList: [],
      imgImport: null,
      logComment: ''
    }
  },
  computed: {
    bgImage() {
      return this.$store.state.bgImage
    }
  },
  created() {
    this.imgImport = db.collection('bgImages').orderBy('date').onSnapshot(
      ss => {
        let w = []
        ss.forEach( doc => w.push( doc.data() ) )
        this.imgList = w
      })
  },
  methods: {
    changeBg(x) {
      this.$store.commit(constants.mutations.bgImage,x)
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return;
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    },
    // 画像アップロード処理 5MB未満で制限 firestorage.rules
    upload() {
      const self = this
      const storageRef = firebase.storage().ref()
      const uploadTask = storageRef.child(`images/${this.imageName}`).put(this.imageFile);
      uploadTask.on('state_changed', function(snapshot){
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // console.log('アップロード' + progress)
        self.logComment = 'アップロード' + progress + '%'
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            // console.log('アップロード停止')
            self.logComment = 'アップロード停止'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            // console.log('アップロード中')
            self.logComment = 'アップロード中'
            break;
        }
      }, function(error) {
        console.log(error)
        switch (error.code) {
          case 'storage/invalid-argument':
            alert('ファイルを選択してください')
            break
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break
          case 'storage/canceled':
            // User canceled the upload
            break

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break
        }
      }, function() {
        const nowtime = new Date()
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          // console.log('アップロード完了')
          self.logComment = 'アップロード完了'
          db.collection('bgImages').add({
            date: nowtime,
            url: downloadURL
          })
        })
      })
    }
  },
  beforeDestroy() {
    this.imgImport()
  }
}
</script>

<style lang="scss" scoped>
$primaryBlue: #71C3D2;
$primaryOrange: #EB7A35;

.modal-box {
  padding: 30px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 90%;
  max-width: 640px;
  background: #FFF;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.1);
  .head {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 { font-size: 20px;
      &:before {
        margin-right: .5em;
        content: "\f013";
        color: #888;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
      }
    }
    .close { line-height: .8; font-size: 30px; cursor: pointer;
      &:before {
        content: "\f00d";
        color: #888;
        font-family: "Font Awesome 5 Free";
        font-weight: 900;
      }
    }
  }
  .tab { font-size: 16px;
    .tab-head { position: relative; display: flex;
      & > li {
        padding: .5em;
        position: relative;
        border-bottom: 3px solid #CCC;
        width: 25%;
        text-align: center;
        cursor: pointer;
        transition: .3s;
        &.active { border-bottom-color: $primaryOrange; }
        &:hover { background: #eb7b3513; }
        &:last-child { padding: .5em 0; }
      }
      &:before {
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 3px;
        content: "";
        background: #CCC;
      }
    }
    .tab-contents { padding-top: 30px; overflow: auto; height: 350px;
      &.active { display: block; }
      .bg-img-list { display: flex; flex-wrap: wrap;
        li {
        outline: 4px solid transparent;
        outline-offset: -4px;
        width: 30%;
        line-height: 0;
        cursor: pointer;
        transition: .3s;
          img { width: 100%; }
          &:not(:nth-child(3n)) { margin-right: 5%; }
          &:nth-child(n+4) { margin-top: 5%; }
          &.active { outline-color: $primaryOrange; }
        }
      }
      .upload-area { margin-top: 5%;
        .btn-wrap {
          margin-top: 15px;
          display: flex;
          align-items: center;
        }
        .btn-upload {
          padding: .5em;
          border-radius: 5px;
          width: 150px;
          line-height: 1;
          color: #FFF;
          background: $primaryOrange;
          text-align: center;
          cursor: pointer;
          transition: .3s;
          &:before {
            margin-right: .5em;
            font-family: "Font Awesome 5 Free";
            content: '\f093';
            font-weight: 900;
          }
          &:hover { background: #dc7330; }
        }
        .log-area { margin-left: 15px; }
      }
    }
  }
}
</style>
