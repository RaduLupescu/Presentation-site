"use strict"

angular.module("radsite", [])

.controller("radtroller", function ($scope) {
    var date = new Date();

    $scope.hours = date.getHours();
    $scope.minutes = date.getMinutes();

    $scope.greetAccordingToTime = function () {
        if ($scope.hours > 6) {
            if ($scope.hours < 13) {
                return "Good morning";
            } else if ($scope.hours < 19) {
                return "Good afternoon";
            } else if ($scope.hours < 24) {
                return "Good evening";
            }
        } else {
            return "Good night!";
        }
    };
    
    $scope.hello = $scope.greetAccordingToTime();

    console.log("hi ", $scope.hello);
}); 