importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js"
);

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

firebase.initializeApp(firebaseConfig);
const initMessage = firebase.messaging();
