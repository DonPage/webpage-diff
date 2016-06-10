"use strict";
///<reference path="../../typings/mocha/mocha.d.ts"/>
var util_commands_1 = require('../commands/util.commands');
var sitemap_1 = require('../misc/sitemap');
var async = require('async');
var env = require('../config/environment/index');
var production_1 = require('../config/environment/production');
var urlArray = [];
var viewports = [320, 768, 1200];
function recursiveObjMapping(obj) {
    // console.log('obj ', obj);
    for (var key in obj) {
        if (typeof (obj[key]) === 'string')
            urlArray.push(obj[key]);
        else if (typeof (obj[key]) === 'function')
            urlArray.push(obj[key]());
        else if (typeof (obj[key]) === 'object')
            recursiveObjMapping(obj[key]);
    }
}
describe('Find visual differences between Production and Staging', function () {
    describe('~~~', function () {
        before(function (client, done) {
            console.log('env ', env);
            // Need to login.
            client
                .url(production_1.production.urls.homepage)
                .waitForElementVisible('#bodyTag', 20000)
                .pause(1000)
                .setValue('input[name=login]', production_1.production.login.username)
                .setValue('input[name=passwd]', production_1.production.login.password)
                .pause(1000)
                .click('#Submit')
                .perform(function (client) {
                recursiveObjMapping(sitemap_1.sitemap);
                done();
            });
        });
        after(function (client, done) {
            client.end(function () {
                done();
            });
        });
        it('Take pictures of Production in different screen sizes.', function (client, nextTest) {
            async.eachSeries(urlArray, function (slug, next) {
                client
                    .url(production_1.production.urls.homepage + slug)
                    .waitForElementVisible('body')
                    .pause(3000)
                    .perform(function (client, done) {
                    async.eachSeries(viewports, function (width, next) {
                        client.resizeWindow(width, 5000).pause(1000)
                            .perform(function (client, done) {
                            util_commands_1.takeScreenshot(client, "PRODUCTION-" + slug.replace(new RegExp('/', 'g'), '|') + "-" + width);
                            next();
                            done();
                        });
                    });
                    next();
                    done();
                });
            }, function () { return nextTest(); });
        });
        it('Take pictures of Staging in different screen sizes.', function (client, nextTest) {
            async.eachSeries(urlArray, function (slug, next) {
                client
                    .url(production_1.production.urls.homepage + slug)
                    .waitForElementVisible('body')
                    .pause(3000)
                    .perform(function (client, done) {
                    async.eachSeries(viewports, function (width, next) {
                        client.resizeWindow(width, 5000).pause(1000)
                            .perform(function (client, done) {
                            util_commands_1.takeScreenshot(client, "STAGING-" + slug.replace(new RegExp('/', 'g'), '|') + "-" + width);
                            next();
                            done();
                        });
                    });
                    next();
                    done();
                });
            }, function () { return nextTest(); });
        });
        it('Compare staging and production screenshots', function (client, done) {
            async.eachSeries(urlArray, function (slug, nextSlug) {
                async.eachSeries(viewports, function (width, nextWidth) {
                    var imgMod = slug.replace(new RegExp('/', 'g'), '|') + "-" + width;
                    util_commands_1.compareImages("PRODUCTION-" + imgMod, "STAGING-" + imgMod, function (res) {
                        console.log("\n              ---------------------------------\n              | Page: " + slug + " @ " + width + " px\n              | Same: " + res + "\n              ---------------------------------\n              ");
                        nextWidth();
                    });
                }, function () { return nextSlug(); });
            }, function () { return console.log("DONE COMPARING"); });
        });
    });
});
