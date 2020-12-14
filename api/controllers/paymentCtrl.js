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

/*var gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
  	merchantId: '2m64fb2rx7bznjqc',
  	publicKey: '3r4mhhfs2rwrgb8n',
  	privateKey: 'b253322e398cd662749860fa0c819153'
});*/

var gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Production,
  	merchantId: '3nq8p7mzxftnnyqd',
  	publicKey: 'vvrpngfx7pxzxwjx',
  	privateKey: '6f0ed53afb3559d935bdbf783b03c02d'
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
					  firstName: 	uzername.split(' ')[0],
					  lastName: 	uzername.split(' ')[1],
					  company: 		"Braintree",
					  email: 		userdata.email,
					  phone: 		"312.555.1234",
					  fax: 			"614.555.5678",
					  website: 		"www.apex-4u.com"
					}, (err, result) => {
						//console.log(err);
						//console.log(result);

			      		//--- After delete user card add new one--------------------
					    let creditCardParams = {
						  	customerId: result.customer.id,
						  	number: req.body.card_number,
					 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,//'06/2022',
						  	cvv: req.body.cvv,
						  	cardholderName: uzername
						};
						console.log('if');
						gateway.creditCard.create(creditCardParams, (error, credit_card) => {
						  	// if (error) {
						  		//console.log(error);
						  		console.log(credit_card);
						  		gateway.paymentMethodNonce.create(credit_card.creditCard.token, function(err, response)
						  		{
						  			console.log('****** NONCE *******');
						  			console.log(response);
  									const nonce = response.paymentMethodNonce.nonce;

  									gateway.transaction.sale({
									  amount: req.body.fullPackage.price,
									  paymentMethodNonce: nonce,
									  // deviceData: deviceDataFromTheClient,
									  options: {
									    submitForSettlement: true
									  }
									}, (err, result) => {
										console.log(err);
										console.log(result);
										console.log("Transaction ID= "+result.transaction.id);
										
										if(result.success == true)
										{
											//-- SAVE CARD---------------------
											var new_pack = new cards({
											    userId: req.body.external_customer_id,
											    card_data: credit_card,
											    created_at: new Date()
											});

										  	new_pack.save(function(err, doc)
										  	{
										  		//-- SAVE SUBSCRIPTION------
												var subs = new subscription({
												    userId:req.body.external_customer_id,
												    payment_data: result.transaction,
												    package_data: req.body.fullPackage,
												    created_at: new Date()
												});

											  	subs.save(function(err, docsub){
												    if(doc == null){
												      res.send({
												        data: null,
												        error: 'Something went wrong.Please try later.',
												        status: 0
												      });
												    }else{
												      res.send({
												        data: docsub,
												        status: 1,
												        error: 'payment done successfully!'
												      });
												    }
												});
											//-----------------------------------
											});
										}
										else
										{
											res.send({
										        data: null,
										        status: 0,
										        error: 'Payment Failed'
										      });
										}
									
									});
								});
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
				 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,
					  	cvv: req.body.cvv,
					  	cardholderName: uzername
					};

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
								  amount: req.body.fullPackage.price,
								  paymentMethodNonce: nonce,
								  // deviceData: deviceDataFromTheClient,
								  options: {
								    submitForSettlement: true
								  }
								}, (err, result) => {
									console.log(err);
									console.log(result);
									console.log("Transaction ID= "+result.transaction.id);
									if(result.success == true)
									{
										//-- SAVE CARD---------------------
										var new_pack = new cards({
										    userId: req.body.external_customer_id,
										    card_data: credit_card,
										    created_at: new Date()
										});

									  	new_pack.save(function(err, doc){
										    //-- SAVE SUBSCRIPTION-------
											var new_pack = new subscription({
											    userId:req.body.external_customer_id,
											    payment_data: result.transaction,
											    package_data: req.body.fullPackage,
											    created_at: new Date()
											});

										  	new_pack.save(function(err, docz){
											    if(docz == null){
											      res.send({
											        data: null,
											        error: 'Something went wrong.Please try later.',
											        status: 0
											      });
											    }else{
											      res.send({
											        data: doc,
											        status: 1,
											        error: 'payment done successfully!'
											      });
											    }
											});
										});
										
										//-----------------------------------
									}
									else
									{
										res.send({
									        data: null,
									        status: 0,
									        error: 'Payment Failed'
									      });
									}
								});
							});
					});
				});
		    	
		    }
  		});
  	});
};

exports.storeCreditCardVaultSignup = function (req, res) 
{
	var number = req.body.card_number,  card_type = '';
	console.log("Price To Be");
	console.log(req.body.fullPackage.price);
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

    gateway.customer.create({
	  firstName: 	req.body.signupName.split(' ')[0],
	  lastName: 	req.body.signupName.split(' ')[1],
	  company: 		"Braintree",
	  email: 		req.body.signupEmail,
	  phone: 		"312.555.1234",
	  fax: 			"614.555.5678",
	  website: 		"www.apex-4u.com"
	}, (err, result) => {
	    let creditCardParams = {
		  	customerId: result.customer.id,
		  	number: req.body.card_number,
	 	 	expirationDate: req.body.exp_month + '/' + req.body.exp_year,
		  	cvv: req.body.cvv,
		  	cardholderName: req.body.signupName
		};
		gateway.creditCard.create(creditCardParams, (error, credit_card) => {
		  		gateway.paymentMethodNonce.create(credit_card.creditCard.token, function(err, response)
		  		{
		  			console.log('****** NONCE *******');
		  			console.log(response);
						const nonce = response.paymentMethodNonce.nonce;

						gateway.transaction.sale({
					  amount: req.body.fullPackage.price,
					  paymentMethodNonce: nonce,
					  options: {
					    submitForSettlement: true
					  }
					}, (err, result) => {
						console.log(err);
						console.log(result);
						console.log("Transaction ID= "+result.transaction.id);
						
						if(result.success == true)
						{
							var nowDate = new Date();
							var expDate = new Date();

							var new_user = new users({
								username: req.body.signupUsername,
								name: req.body.signupName,
								email: req.body.signupEmail,
								password: req.body.signupPassword,
								contact: '',
								zip: '',
								state: '',
								city: '',
								country: '',
								address: '',
								status: 1,
								image: null,
								created_on:new Date(),
								expiry_date: expDate
							});

							new_user.save(function(err, users)
							{
								res.send({
							        data: users,
							        status: 1,
							        error: 'payment done successfully!'
						      	});
								/*var new_pack = new cards({
								    userId: users.data._id,
								    card_data: credit_card,
								    created_at: new Date()
								});

							  	new_pack.save(function(err, doc)
							  	{
							  		if(doc == null){
								      res.send({
								        data: null,
								        error: 'Something went wrong.Please try later.',
								        status: 0
								      });
								    }else{
								      res.send({
								        data: users,
								        status: 1,
								        error: 'payment done successfully!'
								      });
								    }
								});*/
							})
						}
						else
						{
							res.send({
						        data: null,
						        status: 0,
						        error: 'Payment Failed'
						      });
						}
					
					});
				});
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

exports.autoRenewalBrainTree = function (req, res) {
	
	let currentPrice = req.body.package.price;

	cards.find({userId: req.body.user_id}, function(err, card_data)
  	{
  		console.log("MY CARD");
  		let cardToken = card_data[0].card_data.creditCard.token;

  		gateway.paymentMethodNonce.create(cardToken, function(err, response)
		{
			console.log('****** NONCE *******');
			console.log(response);
			const nonce = response.paymentMethodNonce.nonce;

			gateway.transaction.sale({
		  		amount: req.body.package.price,
			  	paymentMethodNonce: nonce,
			  	// deviceData: deviceDataFromTheClient,
			  	options: {
			    	submitForSettlement: true
			  	}
			}, (err, result) => {
				console.log(err);
				console.log(result);
				console.log("Transaction ID= "+result.transaction.id);
				if(result.success == true)
				{
					//-- SAVE SUBSCRIPTION------
					var subs = new subscription({
					    userId:req.body.user_id,
					    payment_data: result.transaction,
					    package_data: req.body.package,
					    created_at: new Date()
					});

				  	subs.save(function(err, docsub){
					    if(docsub == null){
					      res.send({
					        data: result,
					        error: 'Something went wrong.Please try later.',
					        status: 0
					      });
					    }else{
					      res.send({
					        data: docsub,
					        status: 1,
					        error: 'payment done successfully!'
					      });
					    }
					});
				}
				else
				{
					res.send({
				        data: null,
				        status: 0,
				        error: 'Payment failed'
			      	});
				}
		  		
			//-----------------------------------
		});
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
		    	console.log('------------------');
	      		cards.remove({userId: req.body.external_customer_id}, function(err, user) {

	      		let dict = {
		    		object: 'card',
		    		number: req.body.card_number,
		    		exp_month: req.body.exp_month,
		    		exp_year: req.body.exp_year,
		    		// cvv: req.body.cvv,
		    		name: uzername
		    	};

		    	stripe.customers.create({
				  email: userdata.email,
				}).then(cust => {
					console.log(cust);
					let customerId = cust.id;
					stripe.customers.createSource(
					  	customerId,
					  	{source: 'card'}
					).then(card => {
						console.log(card);
						res.json({
					        msg: '',
					        status: 0,
					        data: card
					    });
					}).catch(error => console.error(error));
				}).catch(error => console.error(error));


			  	});
		    }
		    else
		    {
		    	console.log('**********');
		    	let dict = {
		    		object: 'card',
		    		number: req.body.card_number,
		    		exp_month: req.body.exp_month,
		    		exp_year: req.body.exp_year,
		    		// cvv: req.body.cvv,
		    		name: uzername
		    	};

		    	stripe.customers.create({
				  email: userdata.email,
				}).then(cust => {
					console.log(cust);
					let customerId = cust.id;
					stripe.customers.createSource(
					  	customerId,
					  	{source: 'card'}
					).then(card => {
						console.log(card);
						res.json({
					        msg: '',
					        status: 0,
					        data: card
					    });
					}).catch(error => console.error(error));
				}).catch(error => console.error(error));
		    }
  		});
  	});
};

exports.createPaymentIntent = function (req, res){
  const { items, currency } = req.body;

  	// Create or use a preexisting Customer to associate with the payment
  	const customer = stripe.customers.create().then(cust => {
		console.log(cust);
		let customerId = cust.id;
		const paymentIntent = stripe.paymentIntents.create({
	    	amount: calculateOrderAmount(items),
	    	currency: currency,
	    	customer: customerId
	  	}).then(payment => {

		  	// Send publishable key and PaymentIntent details to client
		  	res.send({
		  		'status': 1,
		    	publicKey: 'pk_test_51HmVLvLVj0culcOFpZR7Gl9jsWZilFr0w8t4PgqyQSpTZL9SUANa3wTLlGqVmf39ZspG3WXSwJlTPH7ZKAdsoorM00uZpPx97Y',
		    	clientSecret: payment.client_secret,
		    	id: payment.id
		  	});
		}).catch(error => console.error(error));
	}).catch(error => console.error(error));

  	function calculateOrderAmount(items){
	  	// Replace this constant with a calculation of the order's amount
	  	// Calculate the order total on the server to prevent
	  	// people from directly manipulating the amount on the client
	  	return 50;
	};
  	// Create a PaymentIntent with the order amount and currency and the customer id
  	
};
