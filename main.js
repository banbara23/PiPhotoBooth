const NCMB = require("ncmb");
const ncmb = new NCMB("ab619cd7fc15dceff07b883efaedbacbf29a95e4b4e0451ab7eb32a4a98fd649", "86a27f861398cfdaeca061fb7a94d1366f6a756b3744ef03bdba9cd5450c60f9");
const qr = require('qr-image');
const fs = require('fs');
const Slack = require('slack-node');

const URL = 'https://mb.api.cloud.nifty.com/2013-09-01/applications/6FCGNNPXkvynbFhn/publicFiles/';

webhookUri = "xoxp-108876200531-108268499681-118324535607-1e3eae5c773fb77d95e7f0859d77e744";
slack = new Slack();
slack.setWebhook(webhookUri);

let yyyyMMdd = null;

function run() {
    yyyyMMdd = getPostFileName();
    file = './sample.png';
    readFile(file)
        .then(function(data) {
            return imageUploadToNcmb(data);
        })
        .then(function(fileName) {
            return createQrCode(file);
        })
        .then(function(writeFileName) {
            return readFile(writeFileName);
        })
        .then(function(data) {
            uploadToNcmb(data);
        })
        .then(function(writeFileName) {
            postToSlack(writeFileName)
        })


    fs.readFile(, function(err, data) {
        if (err) throw err;

        ncmb.File.upload(fileName, data)
            .then(createQrCode(URL + data.fileName))
            .then(uploadToNcmb(writeFileName))
            .catch(function(err) {
                console.log(err);
            });
    });
}

function readFile(file) {
    return new Promise(function(resolve, reject) {
        fs.readFile(file, function(err, data) {
            if (err) {
                reject();
            }
            resolve(data);
        })
    })
}

function imageUploadToNcmb(data) {
    const fileName = yyyyMMdd + ".png";
    return ncmb.File.upload(fileName, data);
}

/**
 * urlからQRコードを作成
 * @param {写真URL} url 
 */
function createQrCode(url) {
    return new Promise(function(resolve) {
        console.log(url);
        let qr_svg = qr.image(url, { type: 'png' });
        let writeFileName = 'qr_' + yyyyMMdd + '.png';
        qr_svg.pipe(fs.createWriteStream(writeFileName));
        resolve(writeFileName);
    })
}

function uploadToNcmb(data) {
    let writeFileName = 'qr_' + yyyyMMdd + '.png';
    ncmb.File.upload(writeFileName, data)
        .then(function() {
            return writeFileName;
        })
}

/**
 * QRコードをncmbにアップロード
 */
function postToSlack() {
    // slack emoji 
    slack.webhook({
        channel: "#test",
        username: "bot",
        icon_emoji: ":ghost:",
        text: "test message, test message"
    }, function(err, response) {
        console.log(response);
    });
}
// http://chart.apis.google.com/chart?cht=qr&chs=130x130&chl=https://mb.api.cloud.nifty.com/2013-09-01/applications/6FCGNNPXkvynbFhn/publicFiles/sample.png

/**
 * yyyyMMdd形式を作る
 */
function getPostFileName() {
    const date = new Date(); // 現在日時を生成
    const yyyy = date.getFullYear(); // 西暦を取得
    let mm = date.getMonth() + 1; // 月を取得（返り値は実際の月-1なので、+1する）
    let dd = date.getDate(); // 日を取得

    // 月と日が一桁の場合は先頭に0をつける
    if (mm < 10) {
        mm = "0" + mm;
    }
    if (dd < 10) {
        dd = "0" + dd;
    }
    return yyyy.toString() + mm.toString() + dd.toString(); // フォーマットを整えて表示
}