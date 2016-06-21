"use strict";
const _ = require('lodash');
process.env.NODE_ENV = process.env.NODE_ENV || 'staging';
let all = {
    env: process.env.NODE_ENV,
    waitForConditionTimeout: 6000,
    urls: {
        homepage: ''
    }
};
const merge = _.merge(all, require(`./${process.env.NODE_ENV}`));
module.exports = merge;
