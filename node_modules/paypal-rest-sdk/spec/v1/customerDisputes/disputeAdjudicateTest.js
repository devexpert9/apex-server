'use strict';

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeAdjudicateRequest = paypal.v1.customerDisputes.DisputeAdjudicateRequest;

describe('DisputeAdjudicateRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeAdjudicateRequest('PP-000-042-635-209');
    request.requestBody({
      "adjudication_outcome": "BUYER_FAVOR"
    });

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);
    });
  });
});
