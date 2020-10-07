//npm install paypal-rest-sdk
var paypal = require('paypal-rest-sdk');
uuid = require('node-uuid');
var PAYPAL_CLIENT = 'AUJwMArV3OrlX73_R8aOCpP3QlI_MeDOsoxwVI2ufXFon_8Va_xRRbSJakVsV4P32x3xR6bB2f4jWdd7';
var PAYPAL_SECRET = 'ENYFR3iyybskBAfmHf7bWnc8PnHLg2LD2JCAYpq-vlRzWELGpyZDJl_1OW-V6aEwNrEeo7-m1yOuQxrR';

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': PAYPAL_CLIENT, 
	'client_secret': PAYPAL_SECRET,
	'headers': {
		'custom': 'header'
	}
});

exports.storeCreditCardVault= function (req, res) {

	var card_data = {
			"type": "visa",
			"number": "4417119669820331",
			"expire_month": "11",
			"expire_year": "2020",
			"cvv2": "123",
			"first_name": "Joe",
			"last_name": "Shopper",
			"external_customer_id": uuid.v4()
		};

	paypal.creditCard.create(card_data, function(error, credit_card){
	  	if (error) {
		    console.log(error);
		    throw error;
	  	} else {
		    console.log("Create Credit-Card Response");
		    console.log(credit_card);
		    console.log(credit_card.id);console.log(credit_card.type);console.log(credit_card.number);
	  	}
	});
};




