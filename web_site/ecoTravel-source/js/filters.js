'use strict';

/* Filters */
var filters = angular.module('ecoTravel.filters', []);


filters.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]);


filters.filter('suffix', function () {
        return function (text, suffix) {
        	return text + suffix; 
        };
    });
    
filters.filter('g_to_kg', function () {
            return function (text) {
            	return text/1000; 
            };
   		});
    