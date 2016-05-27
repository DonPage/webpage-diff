"use strict";
///<reference path="../../typings/mocha/mocha.d.ts"/>
var util_commands_1 = require('../commands/util.commands');
var sitemap_1 = require('../misc/sitemap');
var async = require('async');
var env = require('../config/environment/index');
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
describe('Find difference between Production and Staging', function () {
    describe('Take Snapshot of the main production pages', function () {
        before(function (client, done) {
            console.log('env ', env);
            // Need to login.
            client
                .url(sitemap_1.home)
                .waitForElementVisible('#bodyTag', 20000)
                .pause(1000)
                .setValue('input[name=login]', env.login.username)
                .setValue('input[name=passwd]', env.login.password)
                .pause(1000)
                .click('#Submit')
                .perform(function (client) { return done(); });
        });
        after(function (client, done) {
            client.end(function () {
                done();
            });
        });
        it('Go to each sitemap page and take a screenshot from each viewport.', function (client) {
            recursiveObjMapping(sitemap_1.sitemap);
            async.eachSeries(urlArray, function (slug, next) {
                client
                    .url(sitemap_1.home + slug)
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
            });
            client
                .pause(4000)
                .expect.element('body').to.be.present.before(1000);
        });
        it('Take screenshots of staging and compare with production.', function (client) {
        });
    });
});