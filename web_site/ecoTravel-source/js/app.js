'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('ecoTravel', ['ecoTravel.filters', 'ecoTravel.services', 'ecoTravel.directives', 'ecoTravel.controllers', '$strap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/_home.html', controller: 'HomeCtrl'});  
    $routeProvider.when('/statistika', {templateUrl: 'partials/_statistika.html', controller: 'StatistikaCtrl'});
    $routeProvider.when('/lestvica', {templateUrl: 'partials/_lestvica.html', controller: 'LestvicaCtrl'});
    $routeProvider.when('/ogljicni-odtis', {templateUrl: 'partials/_ogljicni-odtis.html', controller: 'OgljicniOdtisCtrl'});    
    $routeProvider.when('/mobilna-aplikacija', {templateUrl: 'partials/_mobilna-aplikacija.html', controller: 'MobilnaAplikacijaCtrl'});        
    $routeProvider.when('/moja-poraba', {templateUrl: 'partials/_moja-poraba.html', controller: 'MojaPorabaCtrl'});            
    $routeProvider.otherwise({redirectTo: '/'});
  }]);


// Facebook SDK integration
app.run(function($rootScope, Facebook) {
  $rootScope.Facebook = Facebook;
  Facebook.checkLogin(false);
});

// app.$inject = ["$rootScope", "$location", ""];

app.factory('Facebook', function($http, $rootScope, serverURL) {

    var self = this;
    this.auth = null;
    this.sessionID = null;
    this.user = null;
    this.appUserID = null;
    this.userStats = null;
    this.loginStatus = null;

    return {    
     getAppUserStats: function() {
			return self.userStats; 	
     },
    
      getAppUserID: function() {
      	return self.appUserID;
      	
      },
    
      createSessionID: function(accessToken) {
//      		$http({withCredentials: true}).get('http://192.168.10.111:8080/user/login/'+accessToken).success(function(data) {
//      			self.sessionID = data;
      			FB.api('/me', function(response_user) {
      				self.user = response_user;
      			});
//      		});
      },
	
	  getUser: function() {
	  	return self.user;
	  },
	
      getAuth: function() {
        return self.auth;
      },
      
      getLoginStatus: function() {
      	return self.loginStatus;
      },

      checkLogin: function(promptForLogin) {
	    promptForLogin = typeof promptForLogin !== 'undefined' ? promptForLogin : true;      
		FB.getLoginStatus(function(response) {
          if (response.status === "connected") {
	           $http.defaults.useXDomain = true;
				$http.post(serverURL+'/user/login/'+response.authResponse.accessToken).success(function(data) {
					self.appUserID = data;
					$http.get(serverURL+'/user/summary').success(function(data) {
						self.userStats = data;
					});
				});
          
	          FB.api('/me', function(response_user) {
	          	self.user = response_user;
	          	if(!$rootScope.$$phase) {
	          		$rootScope.$apply();
	          	}
	          });
	          self.auth = response.authResponse;
	        	self.loginStatus = true;	    
	          if(!$rootScope.$$phase) {
	          	$rootScope.$apply();
	          }	        	      
          } else {
	        self.loginStatus = true;  
			if(!$rootScope.$$phase) {
				$rootScope.$apply();
			}        
          	if (promptForLogin != true) return;
            console.log('Facebook not logged in', response);
            FB.login(function(response) {
              if (response.authResponse) {
	               $http.defaults.useXDomain = true;
					$http.post(serverURL+'/user/login/'+response.authResponse.accessToken).success(function(data) {
						self.appUserID = data;
						$http.get(serverURL+'/user/summary').success(function(data) {
							self.userStats = data;
						});
					});
                  FB.api('/me', function(response_user) {
                  	self.user = response_user;
                  	if(!$rootScope.$$phase) {
                  		$rootScope.$apply();
                  	}
                  });
                  self.auth = response.authResponse;
              } else {
                console.log('Facebook login failed', response);
              }
            });
            
          }
        });
      },

      login: function() {

        FB.login(function(response) {
          if (response.authResponse) {
	          FB.api('/me', function(response_user) {
	          	self.user = response_user;
	          	if(!$rootScope.$$phase) {
	          		$rootScope.$apply();
	          	}
	          });
	          self.auth = response.authResponse;
          } else {
            console.log('Facebook login failed', response);
          }
        })
      },

      logout: function() {

        FB.logout(function(response) {
          if (response) {
            self.auth = null;
            self.user = null;
			self.appUserID = null;            
			$http.defaults.useXDomain = true;
			$http.post(serverURL+'/user/logout').success(function(data) {
				//alert(data);
			});
			if(!$rootScope.$$phase) {
				$rootScope.$apply();
			}
          } else {
            console.log('Facebook logout failed.', response);
          }
        })
      }
    }
  });
  
window.fbAsyncInit = function() {
	try {
    	FB.init({
        	appId: '551670011523207', // App ID
    	    cookie: true, // enable cookies to allow the server to access the session
	        xfbml: true  // parse XFBML
		});
	}
	catch (err) {
		txt = "There was an error on this page.\n\n";
		txt += "Error description: " + err.message + "\n\n";
		txt += "Click OK to continue.\n\n";
			//alert(txt);
	}
};

// Load the SDK Asynchronously
(function(d){
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "//connect.facebook.net/sl_SI/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));