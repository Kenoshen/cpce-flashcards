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
	$scope.maxQuestions = 50;
	$scope.done = false;
	$scope.questions = [];
	$scope.answered = [];
	$scope.correct = 0;
	$scope.total = 0;

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
		$scope.total++;
		$scope.correct += (answer === $scope.question.answer ? 1 : 0);
		$timeout(function(){
			$scope.nextQuestion();
		}, 500);
	}

	$scope.nextQuestion = function(){
		$scope.currentQuestionIndex++;
		if ($scope.currentQuestionIndex >= $rootScope.currentTest.length || $scope.currentQuestionIndex >= $scope.maxQuestions){
			$scope.done = true;
		} else {
			$scope.question = $rootScope.currentTest[$scope.currentQuestionIndex];
			$scope.questions.push($scope.question);
			$scope.answers = $rootScope.randomizeAnswers($scope.question);
		}
	};

	$scope.percentage = function(){
		return parseInt("" + ($scope.correct / $scope.total * 100)) + "%";
	};

	$scope.restart = function(){
		$scope.done = false;
		$scope.currentQuestionIndex = -1;
		$scope.questions = [];
		$scope.answered = [];
		$scope.correct = 0;
		$scope.total = 0;
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
			$scope.refresh();
		}	
	}

	$scope.refresh = function(){
		$scope.question = {test: $rootScope.currentTestName, question: "", answer: "", other: ["", "", ""]};
		$rootScope.focusOn("#question");
	};

	$scope.save = function(){
		$rootScope.addQuestion($scope.question, function(){
			$rootScope.go("");
		});
	}

	$scope.addAnotherQuestion = function(){
		$rootScope.addQuestion($scope.question, function(){
			$scope.refresh();
		});
	}

	initialize();
});