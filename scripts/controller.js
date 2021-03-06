var app = angular.module('myCalendar', []);
app.controller("calendarCtrl", function($scope, $http, $timeout){
	//User information
	$scope.inputDate =  null;
	$scope.inputDays = null;
	$scope.inputCountry = null;

	//General functions
	$scope.generateCalendar = function(){
	
		//Some Validations

		//Is a proper date
		var isDate = /^[\d]{1,2}\/[\d]{1,2}\/[\d]{4}$/ig.test($scope.inputDate);
		if(isDate){
			var group = /^([\d]{1,2})\/([\d]{1,2})\/([\d]{4})$/ig.exec($scope.inputDate);
			$scope.userDate = {"d":group[2],"m":parseInt(group[1])-1,"y":group[3]};
			$scope.startDate = new Date($scope.userDate.y,$scope.userDate.m,$scope.userDate.d);
			$scope.endDate = null;
			$scope.currentMonth = null;
		}else { 
			$scope.errormsg = "The date is not valid";
			$timeout( function(){ $scope.errormsg = undefined; }, 5000);
			return false;
		};
		//Is a proper number for days
		var isNumber = /^[\d]+$/ig.test($scope.inputDays);
		if(isNumber){
			$scope.numberOfDays = parseInt($scope.inputDays);
		}else { 
			$scope.errormsg = "The provided days is not valid";
			$timeout( function(){ $scope.errormsg = undefined; }, 5000);
			return false;
		};
		//Is a proper country code
		var isCountrycode = /^[A-Za-z]{2}$/ig.test($scope.inputCountry);
		if(!isCountrycode){
			$scope.errormsg = "The provided country code is not valid";
			$timeout( function(){ $scope.errormsg = undefined; }, 5000);
			return false;
		}
		$scope.errormsg = undefined;
		$scope.days = [];
		$scope.currentDay = null;
		$scope.currentMonthAndYear = null;
		//I need to generate an array containing all the days i wanna show on the calendar.
	 	for(var i=0,k=$scope.numberOfDays;i<k;i++) {
	 		$scope.currentDay = new Date($scope.userDate.y,$scope.userDate.m,$scope.userDate.d).addDays(i);
	 		if($scope.currentMonthAndYear === null){
	 			$scope.currentMonthAndYear = {"m":$scope.currentDay.getMonth(),"y":$scope.currentDay.getFullYear()};
	 		};
	 		$scope.days.push({"date":$scope.currentDay,
	 						  "weekday": $scope.currentDay.getDay(),
	 						  "class":$scope.getDayClass($scope.currentDay.getDay())});
	 	};
	 	$scope.splitToMonths();
	};
	$scope.getDayClass = function(day){
		if(day === 0 || day === 6){
			return "weekend";
		} else {
			return "weekday";
		}
	}
	//Separete on multiple calendars
	$scope.splitToMonths = function(){
		$scope.calendars = [];
		$scope.calendarIndex = 0;
		$.map($scope.days, function(day, i) {
          if($scope.calendars.length === 0){
          	$scope.calendars.push({"calendar":[]});
          };
          	if(day.date.getMonth() === $scope.currentMonthAndYear.m  && day.date.getFullYear() === $scope.currentMonthAndYear.y ){
          		//If the day is in the current calendar block
          		$scope.calendars[$scope.calendarIndex].calendar.push(day);
          		$scope.calendars[$scope.calendarIndex].title = day.date;
          	} else {
          		//If the day is in a new calendar block
          		$scope.currentMonthAndYear = {"m":day.date.getMonth(),"y":day.date.getFullYear()};
          		$scope.calendarIndex++;
          		$scope.calendars.push({"calendar":[]});
          		$scope.calendars[$scope.calendarIndex].calendar.push(day);
          		$scope.calendars[$scope.calendarIndex].title = day.date;
          	}
        });
        $scope.addHiddenSpaces();
	};
	$scope.addHiddenSpaces = function(){
		$.map($scope.calendars, function(data, i) {
			var firstDayOfWeek = data.calendar[0].date.getDay(),
				lastDayOfWeek = data.calendar[data.calendar.length-1].date.getDay();
	 		if(firstDayOfWeek > 0){
				for(var j=0,l=firstDayOfWeek;j<l;j++){
					data.calendar.unshift({"date":null,"class":"hidden"});
				};
	 		};
	 		if(lastDayOfWeek < 6){
				for(var j=0,l=6 - lastDayOfWeek;j<l;j++){
					data.calendar.push({"date":null,"class":"hidden"});
				};
	 		};
		});
		$scope.findHoliday();
	};
	$scope.findHoliday = function(){
		if($scope.startDate.getFullYear() === 2008){
			$http({
			  method: 'GET',
			  url: 'http://holidayapi.com/v1/holidays?country='+$scope.inputCountry+'&year=2008'
			}).then(function successCallback(response) {
			   if(response){
				$.map($scope.calendars, function(data, i) {
					$.map(data.calendar, function(days, k) {
						if(days.date !== null){
							var dateformated = $scope.holidayapiFormatDate(days.date);
							$.map(response.data.holidays, function(holiday, j) {
								if(j === dateformated){
									$scope.calendars[i].calendar[k].class = "holiday";
									$scope.calendars[i].calendar[k].holiday = holiday;
								};
							});
						};
					});
				});
			   }
			}, function errorCallback(response) {
			   alert("An error ocurred when conecting to the holidayapi, maybe the provided country code is wrong or not supported");
			});
		};
	};
	$scope.holidayapiFormatDate = function(date){
		var month = parseInt(date.getMonth())+1,
		    newdate = date.getFullYear() +'-'+ month +'-'+ date.getDate();
		return newdate;
	};
	$scope.hoverDay = function(event,day){
		if(day.holiday){
			$scope.showHolidays = day.holiday;
			var mouseX = event.clientX + document.body.scrollLeft + 10, 
				mouseY = event.clientY + document.body.scrollTop + 10;
			$(".holidaybox").css({"left": mouseX, "top": mouseY });
		};
	};
	$scope.clearDay = function(){
		$scope.showHolidays = null;
	}
});
Date.prototype.addDays = function(days) {
    this.setDate(this.getDate()+parseInt(days));
    return this;
};