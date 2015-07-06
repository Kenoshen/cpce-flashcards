var app = angular.module("studyApp", ["ngRoute"]);

app.run(function($rootScope, $http, $location, $timeout){
	function initialize(){
		$rootScope.tests = null;
		$rootScope.getAll(function(results){
			$rootScope.tests = results;
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
			callback(data)
		}).error(function(data){
			callback(data);
		});
	};

	$rootScope.updateQuestion = function(question, callback){
		$http({
			method: "PUT",
			url: "./",
			data: question
		}).success(function(data){
			$rootScope.tests = data;
			callback(data);
		}).error(function(data){
			callback(data);
		});
	};

	$rootScope.deleteQuestion = function(question, callback){
		console.log(JSON.stringify(question, undefined, 4));
		var id = question._id;
		console.log("DELETE: " + id);
		$http({
			method: "DELETE",
			url: "./",
			params: {id: id}
		}).success(function(data){
			$rootScope.tests = data;
			callback(data);
		}).error(function(data){
			callback(data);
		});
	};

	$rootScope.gotQuestionRight = function(question){
		if (! question.totalAsked){
			question.totalAsked = 0;
		}
		question.totalAsked += 1;
		if (! question.totalCorrect){
			question.totalCorrect = 0;
		}
		question.totalCorrect += 1;
		$http({
			method: "PUT",
			url: "./stats",
			params: {
				correct: true,
				id: question._id
			}
		}).success(function(data){
		}).error(function(data){
		});
	};

	$rootScope.gotQuestionWrong = function(question){
		if (! question.totalAsked){
			question.totalAsked = 0;
		}
		question.totalAsked += 1;
		if (! question.totalCorrect){
			question.totalCorrect = 0;
		}
		$http({
			method: "PUT",
			url: "./stats",
			params: {
				correct: false,
				id: question._id
			}
		}).success(function(data){
		}).error(function(data){
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

	$rootScope.setCurrentSection = function(sectionName, section){
		$rootScope.currentSectionName = sectionName;
		$rootScope.currentSection = section;
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

	$rootScope.splitIntoSections = function(test){
		var sections = {};
		for (var index in test){
			var q = test[index];
			if (! sections.hasOwnProperty(q.category)){
				sections[q.category] = [];
			}
			sections[q.category].push(q);
		}
		return sections;
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
	}).when('/:test/view', {
		templateUrl : 'html/allQuestions.html'
	}).when('/:test/sections', {
		templateUrl : 'html/sections.html'
	}).when('/:test/sections/:id', {
		templateUrl : 'html/sectionQuiz.html'
	}).when('/:test/:id', {
		templateUrl : 'html/editQuestion.html'
	}).otherwise({
		templateUrl : 'html/tests.html'
	});
});


