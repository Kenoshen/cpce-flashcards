var app = angular.module("studyApp", ["ngRoute", "ui.bootstrap"]);

app.run(function($rootScope, tests, $location, $timeout){
	tests.getAllTests(function(){})

	// ///////////////////////////////////////////
	//  Helper methods
	// ///////////////////////////////////////////
	$rootScope.focusOn = function(selector){
		$timeout(function(){$(selector).focus();}, 1);
	};

	$rootScope.setCurrentTest = function(test, testName){
		$rootScope.currentTestName = testName;
		$rootScope.currentTest = test;
	};

	$rootScope.setCurrentSection = function(sectionName, section){
		$rootScope.currentSectionName = sectionName;
		$rootScope.currentSection = section;
	};

	$rootScope.maxDifficulty = 5;

	$rootScope.ratingStates = [
		{stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
		{stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
		{stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
		{stateOn: 'glyphicon-heart'},
		{stateOff: 'glyphicon-off'}
	];

	// ///////////////////////////////////////////
	//  Routing
	// ///////////////////////////////////////////
	$rootScope.go = function(path){
		console.log("go:", path);
		$location.path(path);
	};
});



app.config(function($routeProvider) {
	$routeProvider.when('/:test/new', {
		templateUrl : 'html/newQuestion.html'
	}).when('/:test/quizSetup', {
		templateUrl : 'html/quizSetup.html'
	}).when('/:test/quiz', {
        templateUrl : 'html/quiz.html'
    }).when('/:test/view', {
		templateUrl : 'html/allQuestions.html'
	}).when('/:test/:id', {
		templateUrl : 'html/editQuestion.html'
	}).otherwise({
		templateUrl : 'html/tests.html'
	});
});


