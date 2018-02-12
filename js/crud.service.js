(function () {
	'use strict';

	angular.module('radsite').factory('CRUDService', CRUDService);

	CRUDService.inject = ['$http', '$q'];

	function CRUDService($http, $q) {
		var serverBaseUrl = "https://api.mite.pay360.com";

		return {
			get: get,
			post: post,
			put: put,
			remove: remove,
			export: exportData,
			parseFeed: parseFeed
		};

		function isJson(data) {
			try {
				JSON.parse(data);
			} catch (e) {
				return false;
			}
			return true;
		}

		function contentTypeHeaders(object) {
			if(object) {
				return {'Content-Type': 'application/json'};
			}
			return {'Content-Type': 'text/plain'};
		}

		function fallbackToDefaultData(object) {
			if(object) {
				return object;
			}
			return '';
		}

		function get(url, cache, transformResponseCallback) {
			var deferred = $q.defer();
			$http({
				method: 'GET',
				url: serverBaseUrl + url,
				cache: cache
			})
				.success(function (data) {
					var result = {};
					if (data) {
						result = angular.fromJson(data);
					}
					if (transformResponseCallback) {
						result = transformResponseCallback(data);
					}
					deferred.resolve(result);
				}).error(function (data) {
					if (isJson(data)) {
						deferred.reject(angular.fromJson(data));
					}
					else {
						deferred.reject(data);
					}
				});
			return deferred.promise;
		}

		function post(url, object, transformResponseCallback) {
			var deferred = $q.defer();

			var headers = contentTypeHeaders(object);
			var data = fallbackToDefaultData(object);

			$http({
				method: 'POST',
				url: serverBaseUrl + url,
				data: data,
				headers: headers
			})
				.success(function (data) {
					var result = {};
					if (data) {
						result = angular.fromJson(data);
					}
					if (transformResponseCallback) {
						result = transformResponseCallback(data);
					}
					deferred.resolve(result);
				}).error(function (data, status) {
					var response;
					if (isJson(data)) {
						response = angular.fromJson(data);
						response.httpStatus = status;
						deferred.reject(response);
					}
					else {
						response = data;
						response.httpStatus = status;
						deferred.reject(response);
					}
				});
			return deferred.promise;
		}

		function put(url, object, transformResponseCallback) {
			var deferred = $q.defer();

			var headers = contentTypeHeaders(object);
			var data = fallbackToDefaultData(object);

			$http({
				method: 'PUT',
				url: serverBaseUrl + url,
				data: data,
				headers: headers
			})
				.success(function (data) {
					var result = {};
					if (data) {
						result = angular.fromJson(data);
					}
					if (transformResponseCallback) {
						result = transformResponseCallback(data);
					}
					deferred.resolve(result);
				}).error(function (data) {
					if (isJson(data)) {
						deferred.reject(angular.fromJson(data));
					}
					else {
						deferred.reject(data);
					}
				});
			return deferred.promise;
		}

		function remove(url, transformResponseCallback) {
			var deferred = $q.defer();
			$http({
				method: 'DELETE',
				url: serverBaseUrl + url
			})
				.success(function (data) {
					var result = {};
					if (data) {
						result = angular.fromJson(data);
					}
					if (transformResponseCallback) {
						result = transformResponseCallback(data);
					}
					deferred.resolve(result);
				}).error(function (data) {
					if (isJson(data)) {
						deferred.reject(angular.fromJson(data));
					}
					else {
						deferred.reject(data);
					}
				});
			return deferred.promise;
		}

		function parseFeed(url, transformResponseCallback) {
			var deferred = $q.defer();
			$http.get(url)
				.success(function (data) {
					var result = {};
					if (transformResponseCallback) {
						result = transformResponseCallback(data);
					}
					deferred.resolve(result);
				}).error(function (data) {
					if (isJson(data)) {
						deferred.reject(angular.fromJson(data));
					}
					else {
						deferred.reject(data);
					}
				});
			return deferred.promise;
		}

		function exportData(url, requestData, resultCallback) {

			/* verify that the browser doesn't contain the file download status cookie before submitting the export request */
			var fileDownloadCookie = getFileDownloadCookie();
			if(fileDownloadCookie !== null) {
				document.cookie = 'file-download-status=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/';
			}

			/* request file export through a form submit */
			submitFileDownloadForm(serverBaseUrl + url, {requestData: JSON.stringify(requestData)}, "post");

			/* polling to determine if the export request has finished processing */
			var downloadPolling = window.setInterval(function() {
				var downloadCookie = getFileDownloadCookie();
				if (downloadCookie !== null) {
					document.cookie = 'file-download-status=;expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/';
					$("#download-frame").remove();
					resultCallback(downloadCookie);
					window.clearInterval(downloadPolling);
				}
			}, 2000);

			return downloadPolling;
		}

		/**
		 * send the export file request using a form submit from a hidden iframe
		 * implemented in order to avoid an ajax call which didn't allow creating the file on client
		 * @param path - export url
		 * @param params - request parameters added as values of the form hidden input fields
		 * @param method - post
		 */
		function submitFileDownloadForm(path, params, method) {

			/* verify that no other iframes exist */
			var existingFrames = $("body iframe #download-frame");
			if(existingFrames.length !== 0) {
				angular.forEach(existingFrames, function(frame) {
					$(frame).remove();
				})
			}

			/* create the iframe */
			var iframe = document.createElement("iframe");
			iframe.setAttribute("name", "download-frame");
			iframe.setAttribute("id", "download-frame");
			iframe.setAttribute("style", "display:none");

			/* create the form and set the iframe as target */
			var form = document.createElement("form");
			form.setAttribute("method", method);
			form.setAttribute("action", path);
			form.setAttribute("target", "download-frame");

			for(var key in params) {
				if(params.hasOwnProperty(key)) {
					var hiddenField = document.createElement("input");
					hiddenField.setAttribute("type", "hidden");
					hiddenField.setAttribute("name", key);
					hiddenField.setAttribute("value", params[key]);

					form.appendChild(hiddenField);
				}
			}

			document.body.appendChild(iframe);
			document.getElementById("download-frame").appendChild(form);
			form.submit();
		}

		/**
		 * function used to find the file download status cookie.
		 * @returns value of the cookie if it exists: 1.success 2.fail 3.null
		 */
		function getFileDownloadCookie() {
			var cookies = document.cookie.split("; ");
			for(var i = 0; i < cookies.length; i++) {
				var pair = cookies[i].split("=");
				if(pair.length === 2 && pair[0] === "file-download-status") {
					return pair[1];
				}
			}
			return null;
		}
	}
})();
