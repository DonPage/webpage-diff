"use strict";
var env = require('../config/environment/index');
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
        index: '/content/services-0',
        transportation: "/services/transportation-and-map",
        campusDining: "/services/campus-dining",
        shops: "/services/retail-and-shops",
        campusResources: "/services/campus-resources",
    },
    forNurses: {
        index: '/for-nurses',
        governanceCouncil: function () { return (exports.sitemap.forNurses.index + "/nurse-governance-council"); },
        practiceCouncil: function () { return "/content/nurse-practice-council-under-construction"; }
    },
    about: '/about',
    contact: '/contact',
    404: '/404'
};
