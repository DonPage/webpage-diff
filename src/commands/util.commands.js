"use strict";
const imageDiff = require('image-diff');
const ssDir = './results/screenshots';
function takeScreenshot(client, title, ...params) {
    let env = process.env.NODE_ENV;
    let titleMods = `${title}?ENV=${env}`;
    if (params) {
        return new Promise(resolve => {
            client.saveScreenshot(`${ssDir}/${title}.png`)
                .perform((client, done) => {
                resolve(title);
                done();
            });
        });
    }
    else {
        return new Promise(resolve => {
            params.map(val => {
                for (let i in val)
                    titleMods += `&${i}=${val[i]}`;
            });
            client.saveScreenshot(`${ssDir}/${titleMods}.png`)
                .perform((client, done) => {
                resolve(titleMods);
                done();
            });
        });
    }
}
exports.takeScreenshot = takeScreenshot;
function compareImages(img1, img2, cb = () => { }) {
    // console.log(`comparing 
    // ../../results/screenshots/ ${img1}
    // ../../results/screenshots/ ${img2}`);
    imageDiff({
        actualImage: `${ssDir}/${img1}.png`,
        expectedImage: `${ssDir}/${img2}.png`,
        diffImage: `${ssDir}/COMPARE:${img1}+${img2}.png`
    }, (err, imagesAreSame) => {
        cb(imagesAreSame);
    });
    // fs.readFile(`../../results/screenshots/${img1}.png`, 'utf8', () => console.log("callback"));
    // resemble(`./results/screenshots/${img1}.png`).compareTo(`./results/screenshots/${img2}.png`).ignoreColors().onComplete(data => {
    //   console.log('compare data ', data);
    //   return cb(data);
    // })
}
exports.compareImages = compareImages;
