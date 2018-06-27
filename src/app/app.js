import angular from 'angular';
import Chart from 'chart.js';
require("angular-route");

import '../style/app.scss';

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, ['ngRoute'])
  .controller('AppCtrl', function ($scope, $route) {
    // Home page controller
	var randomInt = function (min, max) { // Needed randomInt function to get step values
    return Math.floor(min + Math.random() * (max + 1 - min))
    }
	
	var ctx = document.getElementById("stepsChart"); // needed for Chart.js to make the chart
	var stepsChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        datasets: [{
            label: '# of Steps (Previous Week)',
			//calculate 7 random values for steps
            data: [randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000)],
        },
		{
            label: '# of Steps (This Week)',
			//calculate 7 random values for steps,
            data: [randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000), randomInt(1000, 20000)],
            backgroundColor: [// Made current week values colored, as they are what people would be more interested in.
                '#6200EE',
                '#6200EE',
                '#6200FF',
                '#6200FF',
                '#6200EE',
				'#6200EE',
				'#6200EE'
            ],
        }]
    },
});})
  .controller('LeaderboardCtrl', function ($scope, $http) {
    // Leaderboard controller
    $http({
      method: 'GET',
      url: 'https://randomuser.me/api/?results=10' 
    }).then(function successCallback(response) {
      $scope.users = response.data.results.map(user => {
        user.steps = randomInt(1000, 20000);
        return user;
      });
    }, function errorCallback(response) {
      console.log('api call error');
    });

    var randomInt = function (min, max) {
      return Math.floor(min + Math.random() * (max + 1 - min))
    }
  })
    .controller('FriendsCtrl', function ($scope, $http) {
		$http({ // use same api as Leaderboard, but only pull 4 users
		method: 'GET',
		url: 'https://randomuser.me/api/?results=4'
		}).then(function successCallback(response) {
		$scope.users = response.data.results.map(user => {
        return user;
      });
    }, function errorCallback(response) {
      console.log('api call error');
    });
	 $http({ // grab 10 users this time (could not find a way to split up data returned by API to multiple ng-repeats
		method: 'GET',
		url: 'https://randomuser.me/api/?results=10'
		}).then(function successCallback(response) {
		$scope.friends = response.data.results.map(friend => {
        return friend;
      });
    }, function errorCallback(response) {
      console.log('api call error');
    });
	
	$scope.isDisabled = false;	// Make sure button is not disabled before being pushed	
    
	$scope.sendRequest = function(id) {
        this.isDisabled = true; // if button is pushed, disable button
		$("#friend-" + id).css("opacity", "0.5"); //set opacity for entire div to 0.5
	}
		

  })
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        template: require('./home.html'),
        controller: 'AppCtrl'
      })
      .when('/leaderboard', {
        template: require('./leaderboard.html'),
        controller: 'LeaderboardCtrl'
      })
	  .when('/friends', { //added route for friends page
        template: require('./friends.html'),
        controller: 'FriendsCtrl'
      })
    $locationProvider.hashPrefix('');
  });

export default MODULE_NAME;
