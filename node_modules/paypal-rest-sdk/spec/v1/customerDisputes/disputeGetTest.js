'use strict';

require('../../spec_helper');

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeGetRequest = paypal.v1.customerDisputes.DisputeGetRequest;

describe('DisputeGetRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeGetRequest('PP-000-042-636-306');

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);

      chai.assert.equal(r.result.disputed_transactions[0].gross_amount.value, "10.15");
      chai.assert.equal(r.result.disputed_transactions[0].gross_amount.currency_code, "USD");
      chai.assert.equal(r.result.reason, "MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED");
    });
  });
});
