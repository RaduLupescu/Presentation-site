"use strict";

angular.module("radsite", [])

.controller("radtroller", function ($scope) {
	var date = new Date();

	$scope.skills = ["AngularJS", "JavaScript (ES5 / ES6)", "HTML5", "CSS3", "NodeJS", "HapiJS", "MongoDB", "Grunt", "ASP.NET", "C#", "SQL", "C++", "Java", "SASS", "Git", "MVC", "Unit tests", "Karma", "Integration Tests", "SCRUM", "KanBan", "GoogleMapsAPI", "Autonomy IDOL", "IIS", "Windows server"];

	$scope.getGreetingAccordingToTime = function () {
		var hour = date.getHours();

		if (hour < 0) {
			return "Hello";
		}

		if (hour < 13) {
			return "Good morning";
		} else if (hour < 19) {
			return "Good afternoon";
		} else if (hour < 24) {
			return "Good evening";
		}
	};
	
	$scope.hello = $scope.getGreetingAccordingToTime();
	$scope.experience = $scope.skills.join(" • ");
});