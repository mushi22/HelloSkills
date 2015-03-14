'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
	.value('FIREBASE_URL', 'https://waitandeat-sohaib.firebaseio.com/')
	.factory('dataService', function($firebase, FIREBASE_URL) {
		var dataRef = new Firebase(FIREBASE_URL);
		var fireData = $firebase(dataRef);

		return fireData;
	})
	.factory('partyService', function(dataService) {
		var users = dataService.$child('users');

		var partyServiceObject = {
			saveParty: function(party, userId) {
				//parties.$add(party);
				users.$child(userId).$child('parties').$add(party);
			},
			getPartiesByUserId: function(userId){
				return users.$child(userId).$child('parties');
			}
		};

		return partyServiceObject;
	})
	.factory('textMessageService', function(dataService, partyService) {

		var textMessages = dataService.$child('textMessages');

		var textMessageServiceObject = {
			sendTextMessage: function(party, userId) {
				var newTextMessage = {
					phoneNumber: party.phone,
					size: party.size,
					name: party.name
				};
				textMessages.$add(newTextMessage);
				//party.notified = 'Yes';
				//partyService.parties.$save(party.$id);
				partyService.getPartiesByUserId(userId).$child(party.$id).$update({notified: 'Yes'});

			}
		};

		return textMessageServiceObject;

	})
	.factory('authService', function($firebaseSimpleLogin, $location,$rootScope, FIREBASE_URL, dataService) {
		console.log("test1"); Parse.initialize("HQmgIBhPDlDtMAnFPqoxjBK02sNfSlBG4som8cQA","8gbgYeT1x46HszsfokCED4LllwCvbZUPOc6VKedy");
		var authRef = new Firebase(FIREBASE_URL);
		var auth = $firebaseSimpleLogin(authRef);
		var emails = dataService.$child('emails');

		var authServiceObject = {
			register:function(user) {
				auth.$createUser(user.email, user.password).then(function(data) {
					console.log(data);
					emails.$add({email: user.email});
					authServiceObject.login(user);
				});

			},
			login: function(user) {
				/*console.log(user);
						console.log(password);
						Parse.User.logIn(user, "password", {
  							success: function(user) {
    						// Do stuff after successful login.
    						console.log("success");
    						$location.path('/waitlist');
 						 },
  							error: function(user, error) {
  							  // The login failed. Check error to see why.
  							  console.log("failed");
  						}
					});*/
				console.log('password');
				console.log(user.password);
				auth.$login('password', user).then(function(data){
				console.log(data);
				//redirect to waitlist page
				$location.path('/waitlist');
			});
			},
			logout: function() {
				auth.$logout();
				$location.path('/');
			},

			getCurrentUser: function() {
				return auth.$getCurrentUser();
			}

		};

		$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
			//console.log("User"+ user.id + " successfully logged in!") //save currentUser on our rootscope
			$rootScope.currentUser = user;
		});

		$rootScope.$on("$firebaseSimpleLogin:logout", function() {
			//console.log("User"+ user.id + " successfully logged in!") //save currentUser on our rootscope
			$rootScope.currentUser = null;
		});

		return authServiceObject;
	});