(function () {
	'use strict';

	angular.module('radsite').controller('Pay360Ctrl', Pay360Ctrl);

	Pay360Ctrl.inject = ["CRUDService"];

	function Pay360Ctrl(CRUDService) {
		var viewModel = this;

		viewModel.api = {
			"username": "PXICZ5BM5VH4VIXBBWOA7PHE4I",
			"password": "YCyp4sugOMZF7Zij1G4OSw==",
			"installation": "5303840",
			"endpoint": "https://api.mite.pay360.com"
		};

		viewModel.apiRequest = {
		  "session" : {
		    "returnUrl" : {
		      "url" : "http://lupe.me"
		    }
		  },
		  "transaction" : {
		    "merchantReference" : "934503934503",
		    "money" : {
		      "currency" : "GBP",
		      "amount" : {}
		    },
		    "description" : "Radu-test-transaction"
		  },
		  "customer" : {
		    "identity" : {
		      "merchantCustomerId" : "1111111111111"
		    },
		    "details" : {
		      "name" : "Radu test",
		      "address" : {
		        "line1" : "Somewhere out there",
		        "line2" : "in the vast nothingness of space...",
		        "city" : "in the vast universe",
		        "region" : "Somewhere far away in space and time",
		        "postcode" : "AVS111",
		        "countryCode" : "GBR"
		      },
		      "telephone" : "0044111111111",
		      "emailAddress" : "radutest@example.com",
		      "ipAddress" : "1.1.1.1",
		      "defaultCurrency" : "GBP"
		    }
		  },
		  "customFields" : { }
		};

		console.log("Controller instantiated", viewModel);

		viewModel.getPayment = function () {
			var randomId = Math.floor((Math.random() * 10000000) + 1);
			var apiRequest = angular.copy(viewModel.apiRequest);

			apiRequest.transaction.merchantReference = randomId;
			apiRequest.transaction.description += randomId;
			apiRequest.session.returnUrl.url += randomId;

			console.log("Getting payment", apiRequest);

			return CRUDService.post('/hosted/rest/sessions/' + viewModel.api.installation + '/payments', apiRequest)
				.then(function (result) {
					console.log("Result", result);
					viewModel.paymentUrl = result.redirectUrl;
				}, function (error) {
					console.error(error);
				})
		}
	}

})();