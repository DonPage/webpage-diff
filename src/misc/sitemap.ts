import env = require('../config/environment');

export const home = env.urls.homepage;

export const sitemap = {
  news: '/news',
  events: '/events',
  employee: {
    index: '/employee-spotlight',
    stories: () => `${sitemap.employee.index}/employee-stories`,
    featuredDepartments: () => `${sitemap.employee.index}/departments`,
    patientStories: () => `${sitemap.employee.index}/patient-stories`,
    why: () => `${sitemap.employee.index}/why-florida-hospital`,
    photography: () => `${sitemap.employee.index}/fhotography`
  },
  services: {
    index: '/service',
    transportation: () => `${sitemap.services.index}/transportation-and-map`,
    campusDining: () => `${sitemap.services.index}/campus-dining`,
    shops: () => `${sitemap.services.index}/retail-and-shops`,
    campusResources: () => `${sitemap.services.index}/campus-resources`,
    conciergeServices: () => `${sitemap.services.index}/concierge-services`
  },
  forNurses: {
    index: '/for-nurses',
    governanceCouncil: () => `${sitemap.forNurses.index}/nurse-governance-council`,
    practiceCouncil: () => `/content/nurse-practice-council-under-construction`
  },
  about: '/about',
  contact: '/contact'
};
