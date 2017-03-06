const NCMB = require("ncmb");
const ncmb = new NCMB("ab619cd7fc15dceff07b883efaedbacbf29a95e4b4e0451ab7eb32a4a98fd649", "86a27f861398cfdaeca061fb7a94d1366f6a756b3744ef03bdba9cd5450c60f9");

const fs = require('fs');
fs.readFile('./sample.png', function(err, data) {
  if (err) throw err;
  var name = "sample.png";
  ncmb.File.upload(name, data)
    .then(function(data) {
      console.log(data);
      // アップロード後処理

      //  urlが以下になる
      //  https://mb.api.cloud.nifty.com/2013-09-01/applications/6FCGNNPXkvynbFhn/publicFiles/sample.png
      getQrCode();
    })
    .catch(function(err) {
      console.log(data);
      // エラー処理
    });
});

// http://chart.apis.google.com/chart?cht=qr&chs=130x130&chl=https://mb.api.cloud.nifty.com/2013-09-01/applications/6FCGNNPXkvynbFhn/publicFiles/sample.png