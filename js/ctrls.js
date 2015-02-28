var app = angular.module("studyApp");
//
app.controller("TestsCtrl", function($scope, $rootScope) {
});
app.controller("FlashCardsCtrl", function($scope, $rootScope, $timeout) {
	$scope.asking = true;
	$scope.currentQuestionIndex = 0;

	if (!($rootScope.currentTest)){
		$rootScope.go("");
	} else {
		$rootScope.randomizeTestQuestions();
		$scope.question = $rootScope.currentTest[$scope.currentQuestionIndex];
		$scope.answers = $rootScope.randomizeAnswers($scope.question);
	}

	$scope.clickedAnswer = function(answer){
		$scope.lastAnswer = answer;
		$timeout(function(){
			$scope.asking = false;
		}, 500);
	}

	$scope.nextQuestion = function(){
		$scope.currentQuestionIndex++;
		if ($scope.currentQuestionIndex >= $rootScope.currentTest.length){
			$scope.currentQuestionIndex = 0;
			$rootScope.randomizeTestQuestions();
		}
		$scope.question = $rootScope.currentTest[$scope.currentQuestionIndex];
		$scope.answers = $rootScope.randomizeAnswers($scope.question);
		$scope.asking = true;
	};
});
app.controller("QuizCtrl", function($scope, $rootScope, $timeout) {
	$scope.currentQuestionIndex = -1;
	$scope.done = false;
	$scope.questions = [];
	$scope.answered = [];

	function initialize(){
		if (!($rootScope.currentTest)){
			$rootScope.go("");
		} else {
			$rootScope.randomizeTestQuestions();
			$scope.nextQuestion();
		}
	}

	$scope.clickedAnswer = function(answer){
		$scope.answered.push(answer);
		$timeout(function(){
			$scope.nextQuestion();
		}, 500);
	}

	$scope.nextQuestion = function(){
		$scope.currentQuestionIndex++;
		if ($scope.currentQuestionIndex >= $rootScope.currentTest.length){
			$scope.done = true;
		} else {
			$scope.question = $rootScope.currentTest[$scope.currentQuestionIndex];
			$scope.questions.push($scope.question);
			$scope.answers = $rootScope.randomizeAnswers($scope.question);
		}
	};

	$scope.restart = function(){
		$scope.done = false;
		$scope.currentQuestionIndex = -1;
		$scope.questions = [];
		$scope.answered = [];
		$scope.nextQuestion();
	};

	initialize();
});
app.controller("EditQuestionCtrl", function($scope, $rootScope) {
});
app.controller("NewQuestionCtrl", function($scope, $rootScope) {
	function initialize(){
		if (!($rootScope.currentTest)){
			$rootScope.go("");
		} else {
			$scope.question = {test: $rootScope.currentTestName, question: "", answer: "", other: ["", "", ""]};
		}	
	}

	$scope.save = function(){
		$rootScope.addQuestion($scope.question, function(){
			$rootScope.go("");
		});
	}

	initialize();
});