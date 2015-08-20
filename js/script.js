"use strict"

angular.module("radsite", [])

.controller("radtroller", function ($scope) {
    var date = new Date();

    $scope.hours = date.getHours();
    $scope.minutes = date.getMinutes();
    
    if ($scope.minutes < 10) {
        $scope.minutes = "0" + $scope.minutes;
    }

    $scope.greetAccordingToTime = function () {
        if ($scope.hours >= 0) {
            if ($scope.hours < 13) {
                return "Good morning";
            } else if ($scope.hours < 19) {
                return "Good afternoon";
            } else if ($scope.hours < 24) {
                return "Good evening";
            }
        } else {
            return "Hello";
        }
    };
    
    $scope.hello = $scope.greetAccordingToTime();
}); 