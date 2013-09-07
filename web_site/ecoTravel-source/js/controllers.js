'use strict';

/* Controllers */
var ecoTravelControllers = angular.module('ecoTravel.controllers', ["$strap"]);

ecoTravelControllers.controller('UserCountCtrl', function($scope, $http, serverURL) {
	$http.get(serverURL+'/api/userCount').success(function(data) {
		$scope.userCount = data;
	});

	$http.get(serverURL+'/user/friends').success(function(data) {
		if (data && data != "Nisi prijavljen!") {
			$scope.friendsCount =  parseInt(data.length)-1; // 1 od frendov smo mi sami :)
		}
	});
});

ecoTravelControllers.controller('HomeCtrl', function($scope, $http, serverURL, chartColors) {
	$http.get(serverURL+'/api/graph').success(function(data) {
		$scope.graphData = [];
		var i = 0;
		var total = 0;
		var saved = 0;
		for (var row in data) {
			total += data[row].total;
			if (data[row].saved) {
				saved += data[row].saved;			
			}
		}
		$scope.graphData.push({label:'Poraba v kg', value:Math.round(total/1000), color: chartColors[0]});		
		$scope.graphData.push({label:'Prihranek v kg', value:Math.round(saved/1000), color: chartColors[2]});				
	});
	
	$http.get(serverURL+'/api/scoreboard/alltime').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
		
		$scope.lestvicaTop = data.slice(0,5);
	});
});

ecoTravelControllers.controller('StatistikaCtrl', function($scope, $http, serverURL, chartColors, transportNames) {
	$http.get(serverURL+'/api/graph').success(function(data) {
		$scope.statByKM = [];
		$scope.statByCO = [];	
		$scope.statBySA = [];
		$scope.statByType = [];			
		
		var i = 0;
		var total = 0;
		var saved = 0;
		var km = 0;
		
		for (var row in data) {
			total += data[row].total;
			km += data[row].km;						
			$scope.statByType.push({name:transportNames[row], total:Math.round(data[row].total/1000), avg:Math.round((data[row].total)/data[row].number,2), number:data[row].number});			
			$scope.statByKM.push({label:transportNames[row] + " (km)", value:Math.round(data[row].km), color:chartColors[i]});
			$scope.statByCO.push({label:transportNames[row] + " (kg)", value:Math.round(data[row].total/1000), color:chartColors[i]});			
			if (data[row].saved > 0) {
				$scope.statBySA.push({label:transportNames[row] + " (kg)", value:Math.round(data[row].saved/1000), color:chartColors[i]});						
				saved += data[row].saved;							
			}
			i++;
		}
		
		$scope.totalKM = Math.round(km);
		$scope.totalCO = Math.round(total/1000);
		$scope.totalSA = Math.round(saved/1000);				
	});
});

ecoTravelControllers.controller('LestvicaCtrl', function($scope, $http, serverURL) {	
	$http.get(serverURL+'/api/scoreboard/alltime').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
		
		$scope.lestvicaAllTime = data;
	});

	$http.get(serverURL+'/api/scoreboard/daily').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
			
		$scope.lestvicaDaily = data;
	});

	$http.get(serverURL+'/api/scoreboard/weekly').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
		
		$scope.lestvicaWeekly = data;
	});

	$http.get(serverURL+'/api/scoreboard/monthly').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
		
		$scope.lestvicaMonthly = data;
	});
	
});

ecoTravelControllers.controller('OgljicniOdtisCtrl', function($scope, $http, serverURL) {
});


ecoTravelControllers.controller('MobilnaAplikacijaCtrl', function($scope, $http, serverURL) {
});

ecoTravelControllers.controller('MojaPorabaCtrl', function($scope, $http, serverURL, chartColors, transportNames) {
	// lestvica FB prijateljev
	
	$http.get(serverURL+'/user/friends').success(function(data) {
		for (var row in data) {
			var modes = data[row][2];
			var bsdata = "";
			for (var mode in modes) {
				bsdata += "<span class='ti ti-"+mode+"'>"+Math.round(modes[mode])+"km</span>";
			}
			data[row].bsdata = bsdata;
		}
			
		$scope.lestvicaFB = data;
	});
	
	// povzetek porabe in prihranka
	$http.get(serverURL+'/user/summary').success(function(data) {
		$scope.travelStatsKM = [];
		$scope.travelStatsCO = [];		
		$scope.travelStatsSA = [];				
		
		var i = 0;
		for (var row in data.modes) {
			$scope.travelStatsKM.push({label:transportNames[row] + ' ' + Math.round(data.modes[row].km) + 'km', value:data.modes[row].km, color: chartColors[i]});
			$scope.travelStatsCO.push({label:transportNames[row] + ' ' + Math.round(data.modes[row].total) + 'g', value:data.modes[row].total, color: chartColors[i]});
			if (data.modes[row].saved > 0) {
				$scope.travelStatsSA.push({label:transportNames[row] + ' ' + Math.round(data.modes[row].saved) + 'g', value:data.modes[row].saved, color: chartColors[i]});			
			}
			i++;		
		}
	});
});
