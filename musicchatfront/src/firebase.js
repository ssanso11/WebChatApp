import * as firebase from "firebase/app";
import "firebase/messaging";

var firebaseConfig = {
  apiKey: "AIzaSyBPzatZ-sqLUYAGv0FAlPOGbwqqGn04XuU",
  authDomain: "musicchat-c5106.firebaseapp.com",
  databaseURL: "https://musicchat-c5106.firebaseio.com",
  projectId: "musicchat-c5106",
  storageBucket: "musicchat-c5106.appspot.com",
  messagingSenderId: "554081098891",
  appId: "1:554081098891:web:2ea36ea65eb6ba2b00888e",
  measurementId: "G-C8DH3NBPPK",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
