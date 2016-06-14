///<reference path="../../typings/mocha/mocha.d.ts"/>
import {takeScreenshot, compareImages} from '../commands/util.commands';
import {sitemap} from '../misc/sitemap';
import * as async from 'async';
import {production} from '../config/environment/production';
import {staging} from '../config/environment/staging';

let urlArray = [];
let viewports = [320, 768, 1200];
const imageModFunc = (slug: string, width: number) => `${slug.replace(new RegExp('/', 'g'), '|')}-${width}`;


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
      client
        .url(production.urls.homepage)
        .waitForElementVisible('body', 20000)
        .perform(() => {
          recursiveObjMapping(sitemap);
          urlArray.push('/last-page');
          done();
        })
        .pause(5000);

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
                    `PRODUCTION-${imageModFunc(slug, width)}`
                  ).then(() => { next(); done(); });
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
          .url(staging.urls.homepage + slug)
          .waitForElementVisible('body')
          .pause(3000)
          .perform((client, done) => {
            async.eachSeries(viewports, (width, next) => {
              client.resizeWindow(width, 5000).pause(1000)
                .perform((client, done) => {
                  takeScreenshot(client,
                    `STAGING-${imageModFunc(slug, width)}`
                  ).then(() => { next(); done(); });
                })
            });
            next();
            done();
          });
      }, () => nextTest());

    });

    it('Compare staging and production screenshots', (client) => {

      async.eachSeries(urlArray, (slug, nextSlug) => {
          async.eachSeries(viewports, (width, nextWidth) => {
            compareImages(`PRODUCTION-${imageModFunc(slug, width)}`, `STAGING-${imageModFunc(slug, width)}`, res => {
              console.log(`
              ---------------------------------
              | Page: ${slug} @ ${width} px
              | Same: ${res}
              ---------------------------------
              `);
              nextWidth();
            });
          }, () => nextSlug())
      }, () => client.end())

    });


});
