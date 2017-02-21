"use strict";

angular.module("FancyInput", []);

angular.module("FancyInput").controller("fancyInputCtrl", ['$scope', function ($scope) {
	$scope.error = false;

	var numberRegex = /^\d*$/;
	
	$scope.checkValidity = function () {
		$scope.error = !$scope.inputValue.match(numberRegex);
	};
}]);