
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
