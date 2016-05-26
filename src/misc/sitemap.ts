import env = require('../config/environment');

export const home = env.urls.homepage;

export default {
  news: '/news',
  events: '/events',
  employee: {
    index: '/employee-spotlight',
    stories: `${this.index}/employee-stories`,
    featuredDepartments: `${this.index}/departments`,
    patientStories: `${this.index}/patient-stories`,
    why: `${this.index}/why-florida-hospital`,
    photography: `${this.index}/`
  },
  services: {
    index: '/service',
    transportation: `${this.index}/transportation-and-map`,
    campusDining: `${this.index}/campus-dining`,
    shops: `${this.index}/retail-and-shops`,
    campusResources: `${this.index}/campus-resources`,
    conciergeServices: `${this.index}/concierge-services`
  },
  forNurses: {
    index: '/for-nurses',
    governanceCouncil: `${this.index}/nurse-governance-council`,
    practiceCouncil: `${this.index}/content/nurse-practice-council-under-construction`
  },
  about: '/about',
  contact: '/contact'
};
