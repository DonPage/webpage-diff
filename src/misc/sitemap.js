"use strict";
var env = require('../config/environment');
exports.home = env.urls.homepage;
exports.sitemap = {
    news: '/news',
    events: '/events',
    employee: {
        index: '/employee-spotlight',
        stories: function () { return (exports.sitemap.employee.index + "/employee-stories"); },
        featuredDepartments: function () { return (exports.sitemap.employee.index + "/departments"); },
        patientStories: function () { return (exports.sitemap.employee.index + "/patient-stories"); },
        why: function () { return (exports.sitemap.employee.index + "/why-florida-hospital"); },
        photography: function () { return (exports.sitemap.employee.index + "/fhotography"); }
    },
    services: {
        index: '/service',
        transportation: function () { return (exports.sitemap.services.index + "/transportation-and-map"); },
        campusDining: function () { return (exports.sitemap.services.index + "/campus-dining"); },
        shops: function () { return (exports.sitemap.services.index + "/retail-and-shops"); },
        campusResources: function () { return (exports.sitemap.services.index + "/campus-resources"); },
        conciergeServices: function () { return (exports.sitemap.services.index + "/concierge-services"); }
    },
    forNurses: {
        index: '/for-nurses',
        governanceCouncil: function () { return (exports.sitemap.forNurses.index + "/nurse-governance-council"); },
        practiceCouncil: function () { return "/content/nurse-practice-council-under-construction"; }
    },
    about: '/about',
    contact: '/contact'
};
