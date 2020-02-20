<template>
  <div class="modal-box">
    <div class="head">
      <h2>設定</h2>
      <div class="close" @click="$parent.modalSetting = false"></div>
    </div>
    <div class="tab">
      <ul class="tab-head">
        <li :class="{'active': tabActive === 1}" @click="tabActive = 1">
          壁紙
        </li>
        <li :class="{'active': tabActive === 2}" @click="tabActive = 2">
          音
        </li>
        <li :class="{'active': tabActive === 3}" @click="tabActive = 3">
          運営
        </li>
      </ul>
      <ul class="tab-contents">
        <li v-if="tabActive === 1">
          <ul class="bg-img-list">
            <li v-for="item in imgList" :key="item.index" :class="{active: item.url == bgImage}" @click="changeBg(item.url)">
              <img :src="item.url" alt="壁紙">
            </li>
          </ul>
          <div class="upload-area">
            <input
              ref="image"
              type="file"
              accept="image/*"
              @change="onFilePicked"
            />
            <div class="btn-wrap">
              <div class="btn-upload" @click="upload">
                アップロード
              </div>
              <div class="log-area">
                {{ logComment }}
              </div>
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
import firebase from '~/plugins/firebase.js'
const db = firebase.firestore()

export default {
  name: 'Setting',
  data () {
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
    bgImage () {
      return this.$store.state.bgImage
    }
  },
  created () {
    this.imgImport = db.collection('bgImages').orderBy('date').onSnapshot(
      (ss) => {
        const w = []
        ss.forEach(doc => w.push(doc.data()))
        this.imgList = w
      })
  },
  beforeDestroy () {
    this.imgImport()
  },
  methods: {
    changeBg (x) {
      this.$store.commit('bgImage', x)
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
      }
    },
    // 画像アップロード処理 5MB未満で制限 firestorage.rules
    upload () {
      const self = this
      const storageRef = firebase.storage().ref()
      const uploadTask = storageRef.child(`images/${this.imageName}`).put(this.imageFile)
      uploadTask.on('state_changed', function (snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        // console.log('アップロード' + progress)
        self.logComment = 'アップロード' + progress + '%'
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            // console.log('アップロード停止')
            self.logComment = 'アップロード停止'
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            // console.log('アップロード中')
            self.logComment = 'アップロード中'
            break
        }
      }, function (error) {
        // console.log(error)
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
      }, function () {
        const nowtime = new Date()
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // console.log('アップロード完了')
          self.logComment = 'アップロード完了'
          db.collection('bgImages').add({
            date: nowtime,
            url: downloadURL
          })
        })
      })
    }
  }
}
</script>
