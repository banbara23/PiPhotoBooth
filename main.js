const firebase = require("firebase");
const config = {
    apiKey: "AIzaSyBnPLpWvDhhPDtcLyF5J2YdTdCLUTRfoGQ",
    authDomain: "banbara-studio.firebaseapp.com",
    databaseURL: "https://banbara-studio.firebaseio.com",
    storageBucket: "banbara-studio.appspot.com",
};
firebase.initializeApp(config);
const qartjs = require('qartjs');

const FILE = 'sample.png'

// todl:画像をアップロード
// https: //firebase.google.com/docs/storage/web/upload-files

// todo:画像からQRコード作成
// https://github.com/kciter/qart.js/blob/master/README.md

const qart = new QArt({
    value: value,
    imagePath: './example.png',
    filter: filter
})