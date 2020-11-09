'use strict';

require('../../spec_helper');

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeRequireEvidenceRequest = paypal.v1.customerDisputes.DisputeRequireEvidenceRequest;

describe('DisputeRequireEvidenceRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeRequireEvidenceRequest('PP-000-042-636-306');
    request.requestBody({
      "action": "SELLER_EVIDENCE"
    });

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);
    });
  });
});
