var app = angular.module('myCalendar', []);
app.controller("calendarCtrl", function($scope, $timeout, $interval, $animate, $http){
	
	//User information
	$scope.inputDate = null;
	$scope.inputDays = null;
	$scope.inputCountry = null;

	$scope.generateCalendar = function(){
	
		//Some Validations

		//Is a proper date
		var isDate = /^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}$/ig.test($scope.inputDate);
		if(isDate){
			var group = /^([\d]{1,2})\/([\d]{1,2})\/([\d]{4})$/ig.exec($scope.inputDate);
			$scope.userDate = {"d":group[2],"m":group[1],"y":group[3]};
			$scope.startDate = new Date($scope.userDate.y,$scope.userDate.m,$scope.userDate.d);
			$scope.endDate = null;
			$scope.currentMonth = null;
		}else { 
			alert("The date is not valid");
			return false;
		};

		//Is a proper number for days
		var isNumber = /^[\d]+$/ig.test($scope.inputDays);
		if(isNumber){
			$scope.numberOfDays = parseInt($scope.inputDays);
		}else { 
			alert("The provided days is not valid");
			return false;
		};

		//Is a proper country code
		var isCountrycode = /^[A-Za-z]{2}$/ig.test($scope.inputCountry);
		if(!isCountrycode){
			alert("The provided country code is not valid");
			return false;
		}


	};

});