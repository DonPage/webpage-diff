"use strict";
var ssDir = './results/screenshots';
function takeScreenshot(client, title) {
    var params = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        params[_i - 2] = arguments[_i];
    }
    console.log('params ', params);
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
