"use strict";
describe('Find difference between Production and Staging', function () {
    describe('Take Snapshot of the main production pages', function () {
        before(function (client, done) {
            done();
        });
        after(function (client, done) {
            client.end(function () {
                done();
            });
        });
        it('Go to each sitemap page and take a screenshot from each viewport.', function (client) {
            client
                .url('http://google.com')
                .expect.element('body').to.be.present.before(1000);
        });
    });
});
