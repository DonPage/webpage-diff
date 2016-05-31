///<reference path="../../typings/mocha/mocha.d.ts"/>
import {takeScreenshot, compareImages} from '../commands/util.commands';
import {home, sitemap} from '../misc/sitemap';
import * as async from 'async';
import * as env from '../config/environment/index';

let urlArray = [];
let viewports = [320, 768, 1200];
function recursiveObjMapping(obj) {
  // console.log('obj ', obj);
  for (let key in obj) {
    if (typeof(obj[key]) === 'string') urlArray.push(obj[key]);
    else if (typeof(obj[key]) === 'function') urlArray.push(obj[key]());
    else if (typeof(obj[key]) === 'object') recursiveObjMapping(obj[key]);
  }
}

describe('Find difference between Production and Staging', function() {

  describe('Take Snapshot of the main production pages', function() {

    before((client, done) => {
      console.log('env ', env);
      // Need to login.
      client
        .url(home)
        .waitForElementVisible('#bodyTag', 20000)
        .pause(1000)
        .setValue('input[name=login]', env.login.username)
        .setValue('input[name=passwd]', env.login.password)
        .pause(1000)
        .click('#Submit')
        .perform((client) => done());

    });

    after(function(client, done) {
      client.end(() => {
        done();
      });
    });

    it('Go to each sitemap page and take a screenshot from each viewport.', (client, nextTest) => {
      recursiveObjMapping(sitemap);

      async.eachSeries(urlArray, (slug, next) => {
        client
          .url(home + slug)
          .waitForElementVisible('body')
          .pause(3000)
          .perform((client, done) => {
            async.eachSeries(viewports, (width, next) => {
              client.resizeWindow(width, 5000).pause(1000)
                .perform((client, done) => {
                  takeScreenshot(client,
                    `PRODUCTION-${slug.replace(new RegExp('/', 'g'), '|')}-${width}`
                  );
                  next();
                  done();
                })
            });
            next();
            done();
          });
      }, () => nextTest());
    });

    it('Take screenshots of staging and compare with production.', (client, nextTest) => {
      async.eachSeries(urlArray, (slug, next) => {
        client
          .url(home + slug)
          .waitForElementVisible('body')
          .pause(3000)
          .perform((client, done) => {
            async.eachSeries(viewports, (width, next) => {
              client.resizeWindow(width, 5000).pause(1000)
                .perform((client, doneSS) => {
                  takeScreenshot(client,
                    `STAGING-${slug.replace(new RegExp('/', 'g'), '|')}-${width}`
                  ).then(() => {
                    let imgMod = `${slug.replace(new RegExp('/', 'g'), '|')}-${width}`;
                    compareImages(`PRODUCTION-${imgMod}`, `STAGING-${imgMod}`, res => {
                      console.log(res);
                      next();
                      doneSS();
                    });

                  })
                });
            }, () => { done(); next();  });
            // next();
            // done();
          });
      }, () => nextTest())
    })
  });
});
