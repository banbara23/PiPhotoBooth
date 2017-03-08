const NCMB = require("ncmb");
const ncmb = new NCMB("ab619cd7fc15dceff07b883efaedbacbf29a95e4b4e0451ab7eb32a4a98fd649", "86a27f861398cfdaeca061fb7a94d1366f6a756b3744ef03bdba9cd5450c60f9");
const qr = require('qr-image');
const fs = require('fs');
const Slack = require('slack-node');

const BASE_URL = 'https://mb.api.cloud.nifty.com/2013-09-01/applications/6FCGNNPXkvynbFhn/publicFiles/';

webhookUri = "xoxp-108876200531-108268499681-118324535607-1e3eae5c773fb77d95e7f0859d77e744";
slack = new Slack();
slack.setWebhook(webhookUri);

const yyyyMMddHHmmss = createDataCode();
const UPLOAD_PHOTO_FILE_NAME = 'photo_' + yyyyMMddHHmmss + ".png"; //ncmbへの保存ファイル名を指定できるので、photo_yyyyMMddHHmmss.pngとする
const UPLOAD_QRCODE_FILE_NAME = 'qr_' + yyyyMMddHHmmss + '.png';
const tmpQrName = 'qrcode.png';

const photo = './sample.png'; //デバッグ用、後で消す

uploadToNcmb(photo, UPLOAD_PHOTO_FILE_NAME)
  .then(function(file) {
    console.log('createQrCode');
    return createQrCode(file);
  })
  .then(function() {
    console.log('readFileQr');
    return uploadToNcmb(tmpQrName, UPLOAD_QRCODE_FILE_NAME);
  })
  .then(function() {
    console.log('postToSlack');
    postToSlack()
  })
  .catch(function(err) {
    console.log(err);
  })

/**
 * 写真をNCMBのファイルストレージへアップロード
 * @param {読み込むファイルのパス} file 
 */
function uploadToNcmb(readFileName, uploadFileName) {
  console.log('uploadToNcmb() fileName:' + readFileName + ' uploadFileName:' + uploadFileName);
  return new Promise(function(resolve) {
    fs.readFile(readFileName, function(err, data) {
      ncmb.File.upload(uploadFileName, data)
        .then(function(response) {
          // console.log(response); 
          resolve()
        })
    })
  })
}

/**
 * urlからQRコードを作成
 * @param {写真URL} url 
 */
function createQrCode(file) {
  return new Promise(function(resolve, reject) {
    let photoUrl = BASE_URL + file;
    console.log(photoUrl);
    let qr_svg = qr.image(photoUrl, { type: 'png' });
    qr_svg.pipe(fs.createWriteStream(tmpQrName));
    resolve();
  })
}

/**
 * Slackに投稿
 */
function postToSlack() {
  const qrcodeUrl = BASE_URL + UPLOAD_QRCODE_FILE_NAME
    // slack emoji 
  slack.webhook({
    channel: "#test",
    username: "bot",
    icon_emoji: ":ghost:",
    text: qrcodeUrl
  }, function(err, response) {
    console.log(response);
  });
}

//現在時刻取得 yyyyMMdd_HHmmss
function createDataCode() {
  const now = new Date();
  const res = "" + now.getFullYear() +
    padZero(now.getMonth() + 1) +
    padZero(now.getDate()) +
    "_" + padZero(now.getHours()) +
    padZero(now.getMinutes()) +
    padZero(now.getSeconds());
  return res;
}

//先頭にゼロ付加
function padZero(num) {
  let result = null;
  if (num < 10) {
    result = "0" + num;
  } else {
    result = "" + num;
  }
  return result;
}