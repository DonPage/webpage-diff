"use strict";
const env = require('../config/environment/index');
exports.home = env.urls.homepage;
exports.sitemap = {
    home: '/',
    404: '/404'
};
