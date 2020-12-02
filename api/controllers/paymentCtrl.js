//npm install paypal-rest-sdk
var paypal = require('paypal-rest-sdk');
uuid = require('node-uuid');
var mongoose  = require('mongoose'),
multer        = require('multer'),
cards         = mongoose.model('cards'),
users = mongoose.model('users'),
braintree = require('braintree'),
subscription         = mongoose.model('subscription');

const stripe = require('stripe')('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');

/*var PAYPAL_CLIENT = 'AUJwMArV3OrlX73_R8aOCpP3QlI_MeDOsoxwVI2ufXFon_8Va_xRRbSJakVsV4P32x3xR6bB2f4jWdd7';
var PAYPAL_SECRET = 'ENYFR3iyybskBAfmHf7bWnc8PnHLg2LD2JCAYpq-vlRzWELGpyZDJl_1OW-V6aEwNrEeo7-m1yOuQxrR';*/

var PAYPAL_CLIENT = 'AYw_y89NFjOHWCYLyNQv2l6vNoydq6QLy_5914yinfhajCc0NNcVadx15JPv_HqYV3LNhSNy4oBMLLqb';
var PAYPAL_SECRET = 'EFJOe9Ps0ZqfNeP178OdKL9DOzHMmlxKgpyEk-Fll_hsSpHIYs6t_iRRTfkfG_tWypxYz_ctFWqKJz22';

/*var PAYPAL_CLIENT = 'AX1vKIdPLlIsj729f3-__Ld9Kp4K1WOOK5ecOLF9zsRog3eBji6V8zNtrp2X1SjymFOWpdmwGotoPpLl';
var PAYPAL_SECRET = 'EPrwIilL9Je1QwW_Bd7rvsdI4aE1TtCjseuendhQV5Cmre6I-BC7w7xNmTKH59y4hIQZDKXda-UQifbl';
*/

/*paypal.configure({
	'mode': 'sandbox',
	'client_id': PAYPAL_CLIENT, 
	'client_secret': PAYPAL_SECRET,
	'headers': {
		'custom': 'header'
	}
});*/
paypal.configure({
	'mode': 'live',
	'client_id': PAYPAL_CLIENT, 
	'client_secret': PAYPAL_SECRET,
	// 'headers': {
	// 	'custom': 'header'
	// }
});

var gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
  	merchantId: '2m64fb2rx7bznjqc',
  	publicKey: '3r4mhhfs2rwrgb8n',
  	privateKey: 'b253322e398cd662749860fa0c819153'
});

exports.storeCreditCardVault_Old = function (req, res) {
	var number = req.body.card_number,  card_type = '';

    var re 	 = new RegExp("^4"),
    amex 	 = new RegExp("^3[47]"),
    diners 	 = new RegExp("^36"),
 	diners1  = new RegExp("^30[0-5]"),
 	jcb 	 = new RegExp("^35(2[89]|[3-8][0-9])"),
 	visae 	 = new RegExp("^(4026|417500|4508|4844|491(3|7))"),
    discover = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");

    if (number.match(re) != null){
        card_type = "visa";
    }else if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)){ 
        card_type = "Mastercard";
    }else if (number.match(amex) != null){
		// AMEX
        card_type = "AMEX";
    }else if (number.match(discover) != null){
        card_type = "Discover";
    }else if (number.match(diners) != null){
        card_type = "Diners";
    }else if (number.match(diners1) != null){
        card_type = "Diners - Carte Blanche";
    }else if (number.match(jcb) != null){
        card_type = "JCB";
    }else if (number.match(visae) != null){
        card_type = "Visa Electron";
    }

    console.log(card_type)
	cards.find({userId: req.body.external_customer_id}, function(err, doc)
  	{
  		users.findOne({_id: req.body.external_customer_id}, function(err, userdata)
  		{
  			let uzername = userdata.name;

  			if(doc) //-- If user have any card then delete that card------
		    {
	      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {
		      		//--- After delete user card add new one--------------------
				    var card_data = {
						"type": card_type,
						"number": req.body.card_number,
						"expire_month": req.body.exp_month,
						"expire_year": req.body.exp_year,
						"cvv2": req.body.cvv,
						"first_name": uzername.split(' ')[0],
						"last_name": uzername.split(' ')[1],
						"external_customer_id": uuid.v4()
					};

					console.log(card_data);

					paypal.creditCard.create(card_data, function(error, credit_card){
					  	if (error) {
						    res.json({
						        msg: 'inquiry table delete..',
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
					"type": card_type,//req.body.type,
					"number": req.body.card_number,
					"expire_month": req.body.exp_month,
					"expire_year": req.body.exp_year,
					"cvv2": req.body.cvv,
					"first_name": uzername.split(' ')[0],
					"last_name": uzername.split(' ')[1],
					"external_customer_id": uuid.v4()
				};

				paypal.creditCard.create(card_data, function(error, credit_card){
				  	if (error) {
					    res.json({
					        msg: 'inquiry table delete!',
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
  	});
};

exports.storeCreditCardVault_BrainTree = function (req, res) {
	var number = req.body.card_number,  card_type = '';

    var re 		= new RegExp("^4"),
    amex 		= new RegExp("^3[47]"),
    diners 		= new RegExp("^36"),
 	diners1 	= new RegExp("^30[0-5]"),
 	jcb 		= new RegExp("^35(2[89]|[3-8][0-9])"),
 	visae 		= new RegExp("^(4026|417500|4508|4844|491(3|7))"),
    discover 	= new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null){
        card_type = "visa";
    }else if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)){ 
        card_type = "Mastercard";
    }else if (number.match(amex) != null){
		// AMEX
        card_type = "AMEX";
    }else if (number.match(discover) != null){
        card_type = "Discover";
    }else if (number.match(diners) != null){
        card_type = "Diners";
    }else if (number.match(diners1) != null){
        card_type = "Diners - Carte Blanche";
    }else if (number.match(jcb) != null){
        card_type = "JCB";
    }else if (number.match(visae) != null){
        card_type = "Visa Electron";
    }

    console.log(card_type);
	cards.find({userId: req.body.external_customer_id}, function(err, doc)
  	{
  		users.findOne({_id: req.body.external_customer_id}, function(err, userdata)
  		{
  			let uzername = userdata.name;

  			if(doc) //-- If user have any card then delete that card------
		    {
	      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {

	      			gateway.customer.create({
					  firstName: uzername.split(' ')[0],
					  lastName: uzername.split(' ')[1],
					  company: "Braintree",
					  email: userdata.email,
					  phone: "312.555.1234",
					  fax: "614.555.5678",
					  website: "www.apex-4u.com"
					}, (err, result) => {
						console.log(err);
						console.log(result);

			      		//--- After delete user card add new one--------------------
					    let creditCardParams = {
						  	customerId: result.customer.id,
						  	number: req.body.card_number,
					 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,//'06/2022',
						  	cvv: req.body.cvv,
						  	cardholderName: uzername
						};
						console.log('if')
						gateway.creditCard.create(creditCardParams, (error, credit_card) => {
						  	// if (error) {
						  		console.log(error);
						  		console.log(credit_card);
						  		gateway.paymentMethodNonce.create(credit_card.creditCard.token, function(err, response)
						  		{
						  			console.log('****** NONCE *******');
						  			console.log(response);
  									const nonce = response.paymentMethodNonce.nonce;

  									gateway.transaction.sale({
									  amount: "99.00",
									  paymentMethodNonce: nonce,
									  // deviceData: deviceDataFromTheClient,
									  options: {
									    submitForSettlement: true
									  }
									}, (err, result) => {
										console.log(err);
										console.log(result);
									});
								});

						  		
							    res.json({
							        msg: 'inquiry table delete..',
							        status: 0,
							        data: error
							    });
						  // 	} 
						  // 	else 
						  // 	{
						  // 		var new_pack = new cards({
								//     userId:   req.body.external_customer_id,
								//     card_data:   credit_card,
								//     created_at: new Date()
								// });

							 //  	new_pack.save(function(err, doc){
								//     if(doc == null){
								//       res.send({
								//         data: null,
								//         error: 'Something went wrong.Please try later.',
								//         status: 0
								//       });
								//     }else{
								//       res.send({
								//         data: doc,
								//         status: 1,
								//         error: 'Testimonial added successfully!'
								//       });
								//     }
								// });
						  // 	}
						});
					});
			  	});
		    }
		    else
		    {
		    	gateway.customer.create({
				  firstName: uzername.split(' ')[0],
				  lastName: uzername.split(' ')[1],
				  company: "Braintree",
				  email: userdata.email,
				  phone: "312.555.1234",
				  fax: "614.555.5678",
				  website: "www.apex-4u.com"
				}, (err, result) => {

					console.log(result);
					console.log(err);
			    	console.log('else case')
			    	let creditCardParams = {
					  	customerId: result.customer.id,
					  	number: req.body.card_number,
				 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,//'06/2022',
					  	cvv: req.body.cvv
					};

					gateway.creditCard.create(creditCardParams, (err, credit_card) => {
						console.log(credit_card);
						// if (error) {
						    res.json({
						        msg: 'inquiry table delete!',
						        status: 0,
						        data: error
						    });
					  // 	} 
					  // 	else 
					  // 	{
					  // 		var new_pack = new cards({
							//     userId:   req.body.external_customer_id,
							//     card_data:   credit_card,
							//     created_at: new Date()
							// });

						 //  	new_pack.save(function(err, doc){
							//     if(doc == null){
							//       res.send({
							//         data: null,
							//         error: 'Something went wrong.Please try later.',
							//         status: 0
							//       });
							//     }else{
							//       res.send({
							//         data: doc,
							//         status: 1,
							//         error: 'Testimonial added successfully!'
							//       });
							//     }
							// });
					  // 	}

					});
				});
		    	
		    }
  		});
  	});
};

exports.storeCreditCardVault = function (req, res) {
	var number = req.body.card_number,  card_type = '';

    var re 		= new RegExp("^4"),
    amex 		= new RegExp("^3[47]"),
    diners 		= new RegExp("^36"),
 	diners1 	= new RegExp("^30[0-5]"),
 	jcb 		= new RegExp("^35(2[89]|[3-8][0-9])"),
 	visae 		= new RegExp("^(4026|417500|4508|4844|491(3|7))"),
    discover 	= new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null){
        card_type = "visa";
    }else if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)){ 
        card_type = "Mastercard";
    }else if (number.match(amex) != null){
		// AMEX
        card_type = "AMEX";
    }else if (number.match(discover) != null){
        card_type = "Discover";
    }else if (number.match(diners) != null){
        card_type = "Diners";
    }else if (number.match(diners1) != null){
        card_type = "Diners - Carte Blanche";
    }else if (number.match(jcb) != null){
        card_type = "JCB";
    }else if (number.match(visae) != null){
        card_type = "Visa Electron";
    }

    console.log(card_type);
	cards.find({userId: req.body.external_customer_id}, function(err, doc)
  	{
  		users.findOne({_id: req.body.external_customer_id}, function(err, userdata)
  		{
  			let uzername = userdata.name;

  			if(doc) //-- If user have any card then delete that card------
		    {
	      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {

	      			gateway.customer.create({
					  firstName: uzername.split(' ')[0],
					  lastName: uzername.split(' ')[1],
					  company: "Braintree",
					  email: userdata.email,
					  phone: "312.555.1234",
					  fax: "614.555.5678",
					  website: "www.apex-4u.com"
					}, (err, result) => {
						console.log(err);
						console.log(result);

			      		//--- After delete user card add new one--------------------
					    let creditCardParams = {
						  	customerId: result.customer.id,
						  	number: req.body.card_number,
					 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,//'06/2022',
						  	cvv: req.body.cvv,
						  	cardholderName: uzername
						};
						console.log('if')
						gateway.creditCard.create(creditCardParams, (error, credit_card) => {
						  	// if (error) {
						  		console.log(error);
						  		console.log(credit_card);
						  		gateway.paymentMethodNonce.create(credit_card.creditCard.token, function(err, response)
						  		{
						  			console.log('****** NONCE *******');
						  			console.log(response);
  									const nonce = response.paymentMethodNonce.nonce;

  									gateway.transaction.sale({
									  amount: "99.00",
									  paymentMethodNonce: nonce,
									  // deviceData: deviceDataFromTheClient,
									  options: {
									    submitForSettlement: true
									  }
									}, (err, result) => {
										console.log(err);
										console.log(result);
									});
								});

						  		
							    res.json({
							        msg: 'inquiry table delete..',
							        status: 0,
							        data: error
							    });
						  // 	} 
						  // 	else 
						  // 	{
						  // 		var new_pack = new cards({
								//     userId:   req.body.external_customer_id,
								//     card_data:   credit_card,
								//     created_at: new Date()
								// });

							 //  	new_pack.save(function(err, doc){
								//     if(doc == null){
								//       res.send({
								//         data: null,
								//         error: 'Something went wrong.Please try later.',
								//         status: 0
								//       });
								//     }else{
								//       res.send({
								//         data: doc,
								//         status: 1,
								//         error: 'Testimonial added successfully!'
								//       });
								//     }
								// });
						  // 	}
						});
					});
			  	});
		    }
		    else
		    {
		    	gateway.customer.create({
				  firstName: uzername.split(' ')[0],
				  lastName: uzername.split(' ')[1],
				  company: "Braintree",
				  email: userdata.email,
				  phone: "312.555.1234",
				  fax: "614.555.5678",
				  website: "www.apex-4u.com"
				}, (err, result) => {

					console.log(result);
					console.log(err);
			    	console.log('else case')
			    	let creditCardParams = {
					  	customerId: result.customer.id,
					  	number: req.body.card_number,
				 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,//'06/2022',
					  	cvv: req.body.cvv
					};

					gateway.creditCard.create(creditCardParams, (err, credit_card) => {
						console.log(credit_card);
						// if (error) {
						    res.json({
						        msg: 'inquiry table delete!',
						        status: 0,
						        data: error
						    });
					  // 	} 
					  // 	else 
					  // 	{
					  // 		var new_pack = new cards({
							//     userId:   req.body.external_customer_id,
							//     card_data:   credit_card,
							//     created_at: new Date()
							// });

						 //  	new_pack.save(function(err, doc){
							//     if(doc == null){
							//       res.send({
							//         data: null,
							//         error: 'Something went wrong.Please try later.',
							//         status: 0
							//       });
							//     }else{
							//       res.send({
							//         data: doc,
							//         status: 1,
							//         error: 'Testimonial added successfully!'
							//       });
							//     }
							// });
					  // 	}

					});
				});
		    	
		    }
  		});
  	});
};

exports.autoRenewalPlan = function (req, res) {
	var paypal = require('paypal-rest-sdk');
	paypal.configure({
		'mode': 'live', //sandbox or live
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

exports.storeCreditCardStripeVault = function (req, res) {
	var number = req.body.card_number,  card_type = '';

    var re 		= new RegExp("^4"),
    amex 		= new RegExp("^3[47]"),
    diners 		= new RegExp("^36"),
 	diners1 	= new RegExp("^30[0-5]"),
 	jcb 		= new RegExp("^35(2[89]|[3-8][0-9])"),
 	visae 		= new RegExp("^(4026|417500|4508|4844|491(3|7))"),
    discover 	= new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null){
        card_type = "visa";
    }else if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)){ 
        card_type = "Mastercard";
    }else if (number.match(amex) != null){
		// AMEX
        card_type = "AMEX";
    }else if (number.match(discover) != null){
        card_type = "Discover";
    }else if (number.match(diners) != null){
        card_type = "Diners";
    }else if (number.match(diners1) != null){
        card_type = "Diners - Carte Blanche";
    }else if (number.match(jcb) != null){
        card_type = "JCB";
    }else if (number.match(visae) != null){
        card_type = "Visa Electron";
    }

    console.log(card_type);
	cards.find({userId: req.body.external_customer_id}, function(err, doc)
  	{
  		users.findOne({_id: req.body.external_customer_id}, function(err, userdata)
  		{
  			let uzername = userdata.name;

  			if(doc) //-- If user have any card then delete that card------
		    {
		    	let dict = {
		    		object: 'card',
		    		number: req.body.card_number,
		    		exp_month: req.body.exp_month,
		    		exp_year: req.body.exp_year,
		    		cvv: req.body.cvv,
		    		name: uzername
		    	}
	      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {

	      			const customer = stripe.customers.create({
					  description: 'My First Test Customer (created for API docs)',
					});

					console.log(customer)

	      			const card =  stripe.customers.createSource(
					  	customer.id,
					  	{source: 'tok_visa'}
					);

					console.log(card);

					res.json({
				        msg: '',
				        status: 0,
				        data: card
				    });


			  	});
		    }
		    else
		    {
		    	
		    	let dict = {
		    		object: 'card',
		    		number: req.body.card_number,
		    		exp_month: req.body.exp_month,
		    		exp_year: req.body.exp_year,
		    		cvv: req.body.cvv,
		    		name: uzername
		    	};

		    	stripe.createToken(card).then(res => {
				    if (res.error){ 
				    	errorEl.textContent = res.error.message;
				    }else {
				    	stripeTokenHandler(res.token)
				    };
				})

				function stripeTokenHandler(token){
					stripe.customers.create({
				        name: uzername,
				        email: userdata.email,
				        source: token
				    }).then(customer =>{
				        // stripe.charges.create({
				        //   amount: req.body.amount * 100,
				        //   currency: "usd",
				        //   customer: customer.id
				        // })

				        const card =  stripe.customers.createSource(
						  	customer.id,
						  	{source: dict}
						);
				    });
				};

				return;

		    	const customerInfo = stripe.customers.create();

				console.log(customerInfo);

		    	const card =  stripe.customers.createSource(
					  	customerInfo.id,
					  	{source: 'tok_visa'}
					);

					console.log(card);

					res.json({
				        msg: '',
				        status: 0,
				        data: card
				    });
		    	
		    }
  		});
  	});
};