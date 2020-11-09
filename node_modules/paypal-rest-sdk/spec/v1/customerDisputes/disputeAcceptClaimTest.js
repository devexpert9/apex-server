'use strict';

require('../../spec_helper');

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeAcceptClaimRequest = paypal.v1.customerDisputes.DisputeAcceptClaimRequest;

describe('DisputeAcceptClaimRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeAcceptClaimRequest('PP-000-042-635-209');
    request.requestBody({
        "note": "Accepting claim"
    });

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);
    });
  });
});
