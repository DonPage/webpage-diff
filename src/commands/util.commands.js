"use strict";
var imageDiff = require('image-diff');
var ssDir = './results/screenshots';
function takeScreenshot(client, title) {
    var params = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        params[_i - 2] = arguments[_i];
    }
    var env = process.env.NODE_ENV;
    var titleMods = title + "?ENV=" + env;
    if (params) {
        return new Promise(function (resolve) {
            client.saveScreenshot(ssDir + "/" + title + ".png")
                .perform(function (client, done) {
                resolve(title);
                done();
            });
        });
    }
    else {
        return new Promise(function (resolve) {
            params.map(function (val) {
                for (var i in val)
                    titleMods += "&" + i + "=" + val[i];
            });
            client.saveScreenshot(ssDir + "/" + titleMods + ".png")
                .perform(function (client, done) {
                resolve(titleMods);
                done();
            });
        });
    }
}
exports.takeScreenshot = takeScreenshot;
function compareImages(img1, img2, cb) {
    if (cb === void 0) { cb = function () { }; }
    console.log("comparing \n  ../../results/screenshots/ " + img1 + "\n  ../../results/screenshots/ " + img2);
    imageDiff({
        actualImage: ssDir + "/" + img1 + ".png",
        expectedImage: ssDir + "/" + img2 + ".png",
        diffImage: 'WUT.png'
    }, function (err, imagesAreSame) {
        cb(imagesAreSame);
    });
    // fs.readFile(`../../results/screenshots/${img1}.png`, 'utf8', () => console.log("callback"));
    // resemble(`./results/screenshots/${img1}.png`).compareTo(`./results/screenshots/${img2}.png`).ignoreColors().onComplete(data => {
    //   console.log('compare data ', data);
    //   return cb(data);
    // })
}
exports.compareImages = compareImages;
