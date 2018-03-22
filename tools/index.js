'use strict';

var piToolsHomepage = angular.module('piToolsHomepage',["ui.bootstrap"]);

function piToolsList($scope) {
   $scope.allTools = true;
   $scope.bulkEdit = false;
   $scope.QA = false;
   $scope.reports= false;
   
   
    var turnOfTriggers = function(){
    	$scope.allTools = false;
   		$scope.bulkEdit = false;
   		$scope.QA = false;
   		$scope.reports= false;
    }

	$scope.triggerAllTools = function(){
		turnOfTriggers();
		$scope.allTools = true;
	}

	$scope.triggerTargetingTools = function(){
		turnOfTriggers();
		$scope.bulkEdit = true;
	}

	$scope.triggerQATools = function(){
		turnOfTriggers();
		$scope.QA = true;
	}
	$scope.triggerReportTools = function(){
		turnOfTriggers();
		$scope.reports= true;
	}
    
};
