import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyAFkY45nWdrOQ3O1IzvasSWBddPGKD3mbI',
  authDomain: 'yurucamp-chat.firebaseapp.com',
  databaseURL: 'https://yurucamp-chat.firebaseio.com',
  projectId: 'yurucamp-chat',
  storageBucket: 'yurucamp-chat.appspot.com',
  messagingSenderId: '266155181934'
}
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export default firebase

export const auth = firebase.auth()
