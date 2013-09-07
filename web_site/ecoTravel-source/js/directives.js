'use strict';

/* Directives */
var ecoTravelDirectives = angular.module('ecoTravel.directives', []);

ecoTravelDirectives.
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

ecoTravelDirectives.
directive('activeLink', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = attrs.href;
            path = path.substring(1); //hack because path does bot return including hashbang
            scope.location = location;
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }

    };
}]);

ecoTravelDirectives.
directive('bsHolder', function() {
	return {
		link: function (scope, element, attrs) {
			Holder.run(); // overkill
	  	}
	};
});

ecoTravelDirectives.
directive('awesomechart', function () {
        return {
            restrict:'E',
            replace:true,
            template:'<canvas>Your web-browser does not support the HTML 5 canvas element.</canvas>',
            link:function (scope, element, attrs) {
                //TODO: it is not cool that AwesomeChart can work with ids only :-( consider sending a pull request for this / or just fork since it is also messing with Array''s prototype
                //TODO: other pb with the lib is that is messing up with the Array.prototype and is in global scope
                var chart = new AwesomeChart(attrs.id);
                chart.chartType = attrs.type || 'default';
                chart.title = attrs.title;

                var redraw = function (newScopeData) {
					if (!newScopeData) return;
                    //clear it up first: not the nicest method (should be a call on AwesomeChart) but no other choice here...
                    chart.ctx.clearRect(0, 0, chart.width, chart.height);

                    var i, data = [], labels = [], colors = [];
                    //TODO: this logic should be moved to the library itself
                    for (i = 0; i < newScopeData.length; i++) {
                        data.push(newScopeData[i].value);
                        labels.push(newScopeData[i].label);
                        colors.push(newScopeData[i].color);
                    }

                    chart.data = data;
                    chart.labels = labels;
                    chart.colors = colors;
                    chart.draw();
                };

                scope.$watch(attrs.data, redraw, true);
            }
        }
    }
);


