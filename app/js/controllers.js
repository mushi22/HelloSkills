'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
	.controller('LandingPageController', [function() {

	}])
	.controller('WaitlistController', ['$scope', 'partyService', 'textMessageService', 'authService',  function($scope, partyService, textMessageService, authService) {

		//bind users parties to $scope.parties
		authService.getCurrentUser().then(function(user) {
			if(user) {
				$scope.parties = partyService.getPartiesByUserId(user.id);
			}
		})

		//Object to store data from waitlist form
		$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};

		//function to save new party to wait list
		$scope.saveParty = function(){
			partyService.saveParty($scope.newParty, $scope.currentUser.id);
			$scope.newParty = {name: '', phone: '', size: '', done: false, notified: 'No'};
		};

		//Function to send text message to a party. 
		$scope.sendTextMessage = function(party) {
			textMessageService.sendTextMessage(party, $scope.currentUser.id);
		};
	}])

	.controller('AuthController', ['$scope','authService', function($scope, authService) {

		//object bound to inputs on the register and login pages
		$scope.user = {email: '', password: ''};

		//meth to register a new user using authService
		$scope.register = function () {
			authService.register($scope.user);
		};

		//method to login user
		$scope.login = function () {
			authService.login($scope.user);
		};

		//method to logout 
		$scope.logout = function() {
			authService.logout();
		};
	}]);