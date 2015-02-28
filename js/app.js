var app = angular.module("studyApp", ["ngRoute"]);

app.run(function($rootScope, $http, $location, $timeout){
	function initialize(){
		$rootScope.tests = null;
		$rootScope.getAll(function(results){
			$rootScope.tests = results;
			$rootScope.randomizeTestQuestions();
		});
	}

	// ///////////////////////////////////////////
	//  API methods
	// ///////////////////////////////////////////
	$rootScope.getAll = function(callback){
		$http.get("./all").success(function(data){
			callback(data)
		}).error(function(data){
			callback(data);
		});
	};

	$rootScope.addQuestion = function(question, callback){
		$http({
			method: "POST",
			url: "./", 
			data: question
		}).success(function(data){
			$rootScope.tests = data;
			$rootScope.randomizeTestQuestions();
			callback(data)
		}).error(function(data){
			callback(data);
		});
	};

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

	$rootScope.randomizeAnswers = function(question){
		var answers = [];
		answers.push(question.answer);
		for (var i = 0; i < question.other.length; i++){
			answers.push(question.other[i]);
		}
		return $rootScope.shuffle(answers);
	};

	$rootScope.randomizeTestQuestions = function(){
		for (var key in $rootScope.tests){
			if ($rootScope.tests.hasOwnProperty(key)){
				var test = $rootScope.tests[key];
				$rootScope.tests[key] = $rootScope.shuffle(test);
			}
		}
	};

	$rootScope.shuffle = function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
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


	initialize();
});



app.config(function($routeProvider) {
	$routeProvider.when('/:test/new', {
		templateUrl : 'html/newQuestion.html'
	}).when('/:test/quiz', {
		templateUrl : 'html/quiz.html'
	}).when('/:test/flashcards', {
		templateUrl : 'html/flashcards.html'
	}).when('/:test/:id', {
		templateUrl : 'html/editQuestion.html'
	}).otherwise({
		templateUrl : 'html/tests.html'
	});
});


