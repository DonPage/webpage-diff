///<reference path="../../typings/mocha/mocha.d.ts"/>
import {takeScreenshot} from '../commands/util.commands';

describe('Find difference between Production and Staging', function() {

  describe('Take Snapshot of the main production pages', function() {

    before((client, done) => {
      done();
    });

    after(function(client, done) {
      client.end(() => {
        done();
      });
    });

    it('Go to each sitemap page and take a screenshot from each viewport.', (client) => {
      
      client
        .url('http://google.com')
        .expect.element('body').to.be.present.before(1000);
    });
  });
});
