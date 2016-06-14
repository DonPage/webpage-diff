"use strict";
///<reference path="../../typings/mocha/mocha.d.ts"/>
var util_commands_1 = require('../commands/util.commands');
var sitemap_1 = require('../misc/sitemap');
var async = require('async');
var production_1 = require('../config/environment/production');
var staging_1 = require('../config/environment/staging');
/**
 * Placeholder variable for holding urls once sitemap goes through "@function imageModFunc".
 * @let urlArray
 */
var urlArray = [];
/**
 * The different viewports you want to test.
 * @let viewports
 */
var viewports = [320, 768, 1200];
/**
 * A Function is needed to replace slashes in URLs so when saving, they are not put into a directory.
 * @function imageModFunc
 * @param {string} slug - URL slug.
 * @param {number} width - Viewport width.
 * @return {string} modString - String with "|" instead of "/" and width attached.
 */
var imageModFunc = function (slug, width) { return (slug.replace(new RegExp('/', 'g'), '|') + "-" + width); };
/**
 * A recursive function is needed to go through an object with urls and return an array.
 * @function recursiveObjMapping
 * @param {object} obj - Sitemap object.
 * @return {void}
 */
function recursiveObjMapping(obj) {
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
    before(function (client, done) {
        client
            .url(production_1.production.urls.homepage)
            .waitForElementVisible('body', 20000)
            .perform(function () {
            recursiveObjMapping(sitemap_1.sitemap);
            urlArray.push('/last-page');
            done();
        })
            .pause(5000);
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
                        util_commands_1.takeScreenshot(client, "PRODUCTION-" + imageModFunc(slug, width)).then(function () { next(); done(); });
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
                .url(staging_1.staging.urls.homepage + slug)
                .waitForElementVisible('body')
                .pause(3000)
                .perform(function (client, done) {
                async.eachSeries(viewports, function (width, next) {
                    client.resizeWindow(width, 5000).pause(1000)
                        .perform(function (client, done) {
                        util_commands_1.takeScreenshot(client, "STAGING-" + imageModFunc(slug, width)).then(function () { next(); done(); });
                    });
                });
                next();
                done();
            });
        }, function () { return nextTest(); });
    });
    it('Compare staging and production screenshots', function (client) {
        async.eachSeries(urlArray, function (slug, nextSlug) {
            async.eachSeries(viewports, function (width, nextWidth) {
                util_commands_1.compareImages("PRODUCTION-" + imageModFunc(slug, width), "STAGING-" + imageModFunc(slug, width), function (res) {
                    console.log("\n              ---------------------------------\n              | Page: " + slug + " @ " + width + " px\n              | Same: " + res + "\n              ---------------------------------\n              ");
                    nextWidth();
                });
            }, function () { return nextSlug(); });
        }, function () { return client.end(); });
    });
});
