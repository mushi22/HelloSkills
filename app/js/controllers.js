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
        
        //object to store from new Studio
        $scope.newStudio = {studioname: '', email: '',phone:'', location: '', done: false, notified: 'No'};
        
        
        $scope.saveStudio = function(){
			partyService.saveStudio($scope.newStudio, $scope.currentUser.id);
            $scope.newStudio = {studioname: '', email: '',phone:'', location: '', done: false, notified: 'No'};
		};
        
        $scope.newClass = {className:'', InstructorName:'', timeOfClass:'',endOfClass:'',DateOfClass:'', DescOfClass:'',DanceType:'',DanceLevel:'',DancePrice:'',done:false, notified: 'No'};
        
        $scope.saveClass = function() {
            partyService.saveClass($scope.newClass);
            $scope.newClass = {className:'', InstructorName:'', timeOfClass:'',endOfClass:'',DateOfClass:'', DescOfClass:'',DanceType:'',DanceLevel:'',DancePrice:'',done:false, notified: 'No'};
        };

        //bind studios
        $scope.allstudios = partyService.getStudios();
        
        
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
            console.log("reached login controller");
			authService.login($scope.user);
            console.log("after Auth controller");

		};

		//method to logout 
		$scope.logout = function() {
			authService.logout();
		};
	}]);