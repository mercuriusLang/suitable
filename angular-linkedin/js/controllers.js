angbootApp.controller('AppCtrl', function AppCtrl($scope, $location, $rootScope, $http) {
	$scope.getLinkedInData = function() {
		if(!$scope.hasOwnProperty("userprofile")){
			IN.API.Profile("me").fields(
					[ "id", "firstName", "lastName", "pictureUrl",
							"publicProfileUrl" ]).result(function(result) {
				// set the model
				$rootScope.$apply(function() {
					var userprofile =result.values[0]
					$rootScope.userprofile = userprofile;
					$rootScope.loggedUser = true;
			    	//go to main
					$location.path("/main");
				});
			}).error(function(err) {
				$scope.error = err;
			});
		}
	};

	$scope.getLinkedInConnection = function(count) {
		var c = count || 25;
		c++;  // the first profile is myself's

		if(!$scope.hasOwnProperty("connections")){
             IN.API.Raw("/people-search:(people:(first-name,last-name,summary,headline,positions:(company:(ticker,name)),educations,picture-url),facets:(code,buckets:(name,code,count)))?facets=network,school&sort=distance&count="+c) 
	                 .result(function(result){
                
                result['people']['values'].shift(); //delete profile of myself

	  	  		$rootScope.$apply(function() {
					var connections = result['people']['values'];
					$rootScope.connections = connections;
				});  	 
	         }).error(function(err) {
			    $scope.error = err;
			 });
 		}
	};

    //logout and go to login screen
	$scope.logoutLinkedIn = function() {
    //retrieve values from LinkedIn
			IN.User.logout();
			delete $rootScope.userprofile;
			delete $rootScope.connections;
			$rootScope.loggedUser = false;
			$location.path("/login");
	};

    //share message
	$scope.post = function() {
		 var payload = { 
            "comment": $scope.message, 
            "visibility": { 
                "code": "anyone"
            } 
         };

	     IN.API.Raw("/people/~/shares?format=json")
		      .method("POST")
		      .body(JSON.stringify(payload))
		      .result(onSuccess)
		      .error(onError);
	};
});