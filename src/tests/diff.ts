///<reference path="../../typings/mocha/mocha.d.ts"/>
import {takeScreenshot, compareImages} from '../commands/util.commands';
import {sitemap} from '../misc/sitemap';
import * as async from 'async';
import * as env from '../config/environment/index';
import {production} from '../config/environment/production';
import {staging} from '../config/environment/staging';

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

describe('Find visual differences between Production and Staging', function() {


    before((client, done) => {
      console.log('env ', env);
      // Need to login.
      client
        .url(production.urls.homepage)
        .waitForElementVisible('#bodyTag', 20000)
        .pause(1000)
        .setValue('input[name=login]', production.login.username)
        .setValue('input[name=passwd]', production.login.password)
        .pause(1000)
        .click('#Submit')
        .perform((client) => {
          recursiveObjMapping(sitemap);
          done();
        });

    });

    after(function(client, done) {
      client.end(() => {
        done();
      });
    });

    it('Take pictures of Production in different screen sizes.', (client, nextTest) => {

      async.eachSeries(urlArray, (slug, next) => {
        client
          .url(production.urls.homepage + slug)
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

    it('Take pictures of Staging in different screen sizes.', (client, nextTest) => {
      async.eachSeries(urlArray, (slug, next) => {
        client
        //TODO: change this to staging url.
          .url('http://prpl.rs' + slug)
          .waitForElementVisible('body')
          .pause(3000)
          .perform((client, done) => {
            async.eachSeries(viewports, (width, next) => {
              client.resizeWindow(width, 5000).pause(1000)
                .perform((client, done) => {
                  takeScreenshot(client,
                    `STAGING-${slug.replace(new RegExp('/', 'g'), '|')}-${width}`
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

    it('Compare staging and production screenshots', (client, done) => {
      async.eachSeries(urlArray, (slug, nextSlug) => {
          async.eachSeries(viewports, (width, nextWidth) => {
            let imgMod = `${slug.replace(new RegExp('/', 'g'), '|')}-${width}`;
            compareImages(`PRODUCTION-${imgMod}`, `STAGING-${imgMod}`, res => {
              console.log(`
              ---------------------------------
              | Page: ${slug} @ ${width} px
              | Same: ${res}
              ---------------------------------
              `);
              nextWidth();
            });
          }, () => nextSlug())
      }, () => console.log("DONE COMPARING"))
    });


});
