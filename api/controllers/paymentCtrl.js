//npm install paypal-rest-sdk
var paypal = require('paypal-rest-sdk');
uuid = require('node-uuid');
var mongoose  = require('mongoose'),
multer        = require('multer'),
cards         = mongoose.model('cards'),
subscription         = mongoose.model('subscription');
/*var PAYPAL_CLIENT = 'AUJwMArV3OrlX73_R8aOCpP3QlI_MeDOsoxwVI2ufXFon_8Va_xRRbSJakVsV4P32x3xR6bB2f4jWdd7';
var PAYPAL_SECRET = 'ENYFR3iyybskBAfmHf7bWnc8PnHLg2LD2JCAYpq-vlRzWELGpyZDJl_1OW-V6aEwNrEeo7-m1yOuQxrR';*/
var PAYPAL_CLIENT = 'AX1vKIdPLlIsj729f3-__Ld9Kp4K1WOOK5ecOLF9zsRog3eBji6V8zNtrp2X1SjymFOWpdmwGotoPpLl';
var PAYPAL_SECRET = 'EPrwIilL9Je1QwW_Bd7rvsdI4aE1TtCjseuendhQV5Cmre6I-BC7w7xNmTKH59y4hIQZDKXda-UQifbl';

paypal.configure({
	//'mode': 'sandbox', //sandbox or live
	'mode': 'live', //sandbox or live
	'client_id': PAYPAL_CLIENT, 
	'client_secret': PAYPAL_SECRET,
	'headers': {
		'custom': 'header'
	}
});

exports.storeCreditCardVault = function (req, res) {

	// var card_data = {
	// 		"type": "visa",
	// 		"number": "4417119669820331",
	// 		"expire_month": "11",
	// 		"expire_year": "2020",
	// 		"cvv2": "123",
	// 		"first_name": "Joe",
	// 		"last_name": "Shopper",
	// 		"external_customer_id": uuid.v4()
	// 	};

	cards.find({userId: req.body.external_customer_id}, function(err, doc)
  	{
	    if(doc) //-- If user have any card then delete that card------
	    {
      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {
	      		//--- After delete user card add new one--------------------
			    var card_data = {
					"type": req.body.type,
					"number": req.body.card_number,
					"expire_month": req.body.exp_month,
					"expire_year": req.body.exp_year,
					"cvv2": req.body.cvv,
					"first_name": req.body.firstname,
					"last_name": req.body.lastname,
					"external_customer_id": uuid.v4()
				};

				paypal.creditCard.create(card_data, function(error, credit_card){
				  	if (error) {
					    res.json({
					        msg: 'inquiry table delet',
					        status: 0,
					        data: error
					    });
				  	} 
				  	else 
				  	{
				  		var new_pack = new cards({
						    userId:   req.body.external_customer_id,
						    card_data:   credit_card,
						    created_at: new Date()
						});

					  	new_pack.save(function(err, doc){
						    if(doc == null){
						      res.send({
						        data: null,
						        error: 'Something went wrong.Please try later.',
						        status: 0
						      });
						    }else{
						      res.send({
						        data: doc,
						        status: 1,
						        error: 'Testimonial added successfully!'
						      });
						    }
						});
				  	}
				});
		  	});
	    }
	    else
	    {
	    	//--- After delete user card add new one--------------------
		    var card_data = {
				"type": req.body.type,
				"number": req.body.card_number,
				"expire_month": req.body.exp_month,
				"expire_year": req.body.exp_year,
				"cvv2": req.body.cvv,
				"first_name": req.body.firstname,
				"last_name": req.body.lastname,
				"external_customer_id": uuid.v4()
			};

			paypal.creditCard.create(card_data, function(error, credit_card){
			  	if (error) {
				    res.json({
				        msg: 'inquiry table delet',
				        status: 0,
				        data: error
				    });
			  	} 
			  	else 
			  	{
			  		var new_pack = new cards({
					    userId:   req.body.external_customer_id,
					    card_data:   credit_card,
					    created_at: new Date()
					});

				  	new_pack.save(function(err, doc){
					    if(doc == null){
					      res.send({
					        data: null,
					        error: 'Something went wrong.Please try later.',
					        status: 0
					      });
					    }else{
					      res.send({
					        data: doc,
					        status: 1,
					        error: 'Testimonial added successfully!'
					      });
					    }
					});
			  	}
			});
	    }
  	});

	
};


exports.autoRenewalPlan = function (req, res) {
	var paypal = require('paypal-rest-sdk');
	paypal.configure({
		'mode': 'sandbox', //sandbox or live
		'client_id': PAYPAL_CLIENT,
		'client_secret': PAYPAL_SECRET
	});
	// var cardData = {
	// 	"intent": "sale",
	// 	"payer": {
	// 		"payment_method": "credit_card",
	// 		"funding_instruments": [{
	// 			"credit_card_token": {
	// 				"credit_card_id": "CARD-97H24964AF825961YL56WD4Q",
	// 				"external_customer_id": "b71710de-15ec-4ef7-9c70-850b95be785b"
	// 			}
	// 		}]
	// 	},
	// 	"transactions": [{
	// 		"amount": {
	// 			"total": "7.50",
	// 			"currency": "USD"
	// 		},
	// 		"description": "This is the payment transaction description."
	// 	}]
	// };

	var dict = {
		"intent": "sale",
		"payer": {
			"payment_method": "credit_card",
			"funding_instruments": [ {
				"credit_card_token": {
					"credit_card_id": req.body.paymentInfo.payer.funding_instruments[0].credit_card_token.credit_card_id,
					"external_customer_id": req.body.paymentInfo.payer.funding_instruments[0].credit_card_token.external_customer_id
				}
			} ]
		},
		"transactions": [{
			"amount": {
				"total": req.body.paymentInfo.transactions[0].amount.total,
				"currency": req.body.paymentInfo.transactions[0].amount.currency
			},
			"description": "This is the payment transaction description."
		}]
	};

	paypal.payment.create(dict, function(error, payment){
		if(error){
			res.send({
		        data: null,
		        'error': error,
		        status: 0
	     	});
		} else {
			//console.log(payment);
			console.log(JSON.stringify(payment));
			var new_pack = new subscription({
			    userId:   req.body.userId,
			    payment_data:   payment,
			    package_data: req.body.package,
			    created_at: new Date()
			});

		  	new_pack.save(function(err, doc){
			    if(doc == null){
			      res.send({
			        data: null,
			        error: 'Something went wrong.Please try later.',
			        status: 0
			      });
			    }else{
			      res.send({
			        data: doc,
			        status: 1,
			        error: 'Testimonial added successfully!'
			      });
			    }
			});
			// res.json({"status": true, "messagePaymentSUccess": "successfully done payment"});
		}
	});
};

