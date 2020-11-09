'use strict';

require('../../spec_helper');

const chai = require('chai');
const client = require('../../test_harness').client();
const DisputeAppealRequest = paypal.v1.customerDisputes.DisputeAppealRequest;
const FormPart = require('braintreehttp').FormPart;
const fs = require('fs');

describe('DisputeAppealRequest', function () {
  xit('works as expected', function () {
    let request = new DisputeAppealRequest('PP-000-042-635-183');
    request.requestBody({
      input: new FormPart({
        evidence_type: 'OTHER',
        notes: 'Notes'
      }, {
        'Content-Type': 'application/json'
      }),
      file1: fs.createReadStream('./spec/v1/customerDisputes/fileupload_test_binary.jpg')
    });

    return client.execute(request).then((r) => {
      chai.assert.equal(r.statusCode, 200);
      chai.assert.isNotNull(r.result);
    });
  });
});
