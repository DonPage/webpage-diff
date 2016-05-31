const imageDiff = require('image-diff');
const ssDir = './results/screenshots';

export function takeScreenshot(client, title: string, ...params: Array<Object>) {
  let env = process.env.NODE_ENV;
  let titleMods = `${title}?ENV=${env}`;
  if (params) {
    return new Promise(resolve => {
      client.saveScreenshot(`${ssDir}/${title}.png`)
        .perform((client, done) => {
          resolve(title);
          done();
        })
    });
  } else {
    return new Promise(resolve => {
      params.map(val => {
        for (let i in val) titleMods += `&${i}=${val[i]}`;
      });

      client.saveScreenshot(`${ssDir}/${titleMods}.png`)
        .perform((client, done) => {
          resolve(titleMods);
          done();
        })
    });
  }

}

export function compareImages (img1: string, img2: string, cb: Function = () => {}) {
  console.log(`comparing 
  ../../results/screenshots/ ${img1}
  ../../results/screenshots/ ${img2}`);
  imageDiff({
    actualImage: `${ssDir}/${img1}.png`,
    expectedImage: `${ssDir}/${img2}.png`,
    diffImage: 'WUT.png'
  }, (err, imagesAreSame) => {
    cb(imagesAreSame);
  });
  // fs.readFile(`../../results/screenshots/${img1}.png`, 'utf8', () => console.log("callback"));
  // resemble(`./results/screenshots/${img1}.png`).compareTo(`./results/screenshots/${img2}.png`).ignoreColors().onComplete(data => {
  //   console.log('compare data ', data);
  //   return cb(data);
  // })
}
