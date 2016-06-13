"use strict";
var _ = require('lodash');
process.env.NODE_ENV = process.env.NODE_ENV || 'staging';
var all = {
    env: process.env.NODE_ENV,
    waitForConditionTimeout: 6000,
    urls: {
        homepage: ''
    }
};
var merge = _.merge(all, require("./" + process.env.NODE_ENV));
module.exports = merge;
