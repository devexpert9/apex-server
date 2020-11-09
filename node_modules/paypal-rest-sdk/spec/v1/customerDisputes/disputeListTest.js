'use strict';

require('../../spec_helper');

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeListRequest = paypal.v1.customerDisputes.DisputeListRequest;

describe('DisputeListRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeListRequest();

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);

      chai.assert.isTrue(r.result.items.length > 0)
    });
  });
});
