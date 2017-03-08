const config = require('./config');
const NCMB = require("ncmb");
const ncmb = new NCMB(config.NCMB.apikey, config.NCMB.clientkey);
const qr = require('qr-image');
const fs = require('fs');
const Slack = require('slack-node');


const BASE_URL = config.NCMB.publicFilesUrl;
const yyyyMMddHHmmss = createDataCode();
const UPLOAD_PHOTO_FILE_NAME = 'photo_' + yyyyMMddHHmmss + ".png"; //NCMBに保存する写真のファイル名
const UPLOAD_QRCODE_FILE_NAME = 'qr_' + yyyyMMddHHmmss + '.png'; //NCMBに保存するQRコード画像のファイル名
const tmpQrName = './qrcode.png'; //ローカル用のQR画像ファイル名

const photo = './sample.png'; //デバッグ用、後で消す

uploadToNcmb(photo, UPLOAD_PHOTO_FILE_NAME)
  .then(function() {
    return createQrCode();
  })
  .then(function() {
    return uploadToNcmb(tmpQrName, UPLOAD_QRCODE_FILE_NAME);
  })
  .then(function() {
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
  console.log('uploadToNcmb() read:' + readFileName + ' upload:' + uploadFileName);
  return new Promise(function(resolve) {
    fs.readFile(readFileName, function(err, data) {
      if (err) throw err;
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
function createQrCode() {
  return new Promise(function(resolve, reject) {
    let photoUrl = BASE_URL + UPLOAD_PHOTO_FILE_NAME;
    console.log(photoUrl);
    let qr_png = qr.image(photoUrl, { type: 'png' });

    // pipeの罠対応、onでキャッチしないと画像出力前に次処理が始まる
    qr_png.pipe(fs.createWriteStream(tmpQrName))
      .on('finish', function() {
        // console.log('qr_png finish');
        resolve();
      });
  })
}

/**
 * Slackに投稿
 */
function postToSlack() {
  const qrcodeUrl = BASE_URL + UPLOAD_QRCODE_FILE_NAME
  console.log(qrcodeUrl);

  const webhookUri = config.Slack.webHookUrl;
  slack = new Slack();
  slack.setWebhook(webhookUri);

  slack.webhook({
    channel: "#test",
    username: "bot",
    icon_emoji: ":ghost:",
    text: qrcodeUrl
  }, function(err, response) {
    if (err) console.log(err);
    console.log(response);
  });
}

/**
 * 現在日時からyyyyMMdd_HHmmss形式の文字列を返す
 */
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