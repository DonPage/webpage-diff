"use strict";
var env = require('../config/environment/index');
exports.home = env.urls.homepage;
exports.sitemap = {
    news: '/news',
    events: '/events',
    // employee: {
    //   index: '/employee-spotlight',
    //   stories: () => `${sitemap.employee.index}/employee-stories`,
    //   featuredDepartments: () => `${sitemap.employee.index}/departments`,
    //   patientStories: () => `${sitemap.employee.index}/patient-stories`,
    //   why: () => `${sitemap.employee.index}/why-florida-hospital`,
    //   photography: () => `${sitemap.employee.index}/fhotography`
    // },
    // services: {
    //   index: '/content/services-0',
    //   transportation: () => `/services/transportation-and-map`,
    //   campusDining: () => `/services/campus-dining`,
    //   shops: () => `/services/retail-and-shops`,
    //   campusResources: () => `/services/campus-resources`,
    // },
    // forNurses: {
    //   index: '/for-nurses',
    //   governanceCouncil: () => `${sitemap.forNurses.index}/nurse-governance-council`,
    //   practiceCouncil: () => `/content/nurse-practice-council-under-construction`
    // },
    about: '/about',
    contact: '/contact'
};
