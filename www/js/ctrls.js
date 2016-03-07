var app = angular.module("studyApp");
//
app.controller("TestsCtrl", function($scope, tests) {
	$scope.tests = tests;
});
app.controller("QuizCtrl", function($scope, $rootScope, $timeout, tests) {
    function initialize(){
        if (! $rootScope.currentQuizConfig){
            $rootScope.go("")
        } else {
            $scope.config = $rootScope.currentQuizConfig;
            $scope.takingQuiz = true
            $scope.testName = $rootScope.currentTestName;
            $scope.curQuestionNumber = 0;
            $scope.totalQuestions = $scope.config.questions.length
            $scope.correct = 0;
            $scope.incorrectAnswers = []
            $scope.continueQuiz();
        }
    }

    $scope.selectPotentialAnswer = function(potentialAnswer){
        if ($scope.showAnswer) return;
        if (potentialAnswer === $scope.question.answer){
            tests.gotQuestionRight($scope.question);
            $scope.correct = 1 + $scope.correct;
        } else {
            tests.gotQuestionWrong($scope.question);
            $scope.incorrectAnswers[$scope.curQuestionNumber] = potentialAnswer;
        }

        if ($scope.config.showAnswers){
            $scope.showAnswer = true
        } else {
            $scope.continueQuiz();
        }
    }

    $scope.continueQuiz = function(){
        $scope.showAnswer = false;
        $scope.curQuestionNumber = 1 + $scope.curQuestionNumber;
        if ($scope.curQuestionNumber > $scope.totalQuestions){
            $scope.takingQuiz = false;

            $scope.correctPercentage = parseInt(($scope.correct / $scope.totalQuestions) * 100);
        } else {
            $scope.question = $scope.config.questions[$scope.curQuestionNumber - 1];
            $scope.question.potentialAnswers = tests.randomizeAnswers($scope.question)
        }
    }

    $scope.retake = function(){
        initialize()
    }

    $scope.back = function(){
        $rootScope.go("");
    }

    initialize();
});
app.controller("ViewTestCtrl", function($scope, $rootScope, tests) {
	if (! $rootScope.currentTest){
		$rootScope.go("");
	} else {
		$scope.questions = $rootScope.currentTest;
		$scope.test = $rootScope.currentTestName;
		$scope.sections = tests.splitIntoSections($scope.questions)
	}

	$scope.edit = function(question){
		$rootScope.currentQuestion = question;
		$rootScope.go("/" + $rootScope.currentTestName + "/" + $rootScope.currentQuestion._id);
	}
});
app.controller("EditQuestionCtrl", function($scope, $rootScope, tests) {
	$scope.question = {};

	function initialize(){
		if (! $rootScope.currentQuestion){
			$rootScope.go("");
		} else {
			$scope.question = $rootScope.currentQuestion;
		}
	}

	$scope.save = function(){
		tests.updateQuestion($scope.question, function(){
			$scope.cancel();
		});
	};

	$scope.cancel = function(){
		$rootScope.go("/" + $rootScope.currentTestName + "/view");
	};

	$scope.delete = function(){
		tests.deleteQuestion($scope.question, function(){
			$scope.cancel();
		});
	};

	initialize();
});
app.controller("NewQuestionCtrl", function($scope, $rootScope, tests) {
	function initialize(){
		if (! $rootScope.currentTest){
			$rootScope.go("");
		} else {
			$scope.refresh();
		}	
	}

	$scope.refresh = function(){
		$scope.question = {
			test: $rootScope.currentTestName, 
			question: "", 
			answer: "", 
			other: ["", "", ""],
			category: "Counseling Families, Diagnosis, and Advanced Concepts",
			notes: ""
		};
		$rootScope.focusOn("#question");
	};

	$scope.save = function(){
		tests.addQuestion($scope.question, function(){
			$rootScope.go("");
		});
	}

	$scope.addAnotherQuestion = function(){
		tests.addQuestion($scope.question, function(){
			$scope.refresh();
		});
	}

	$scope.cancel = function(){
	    $rootScope.go("");
	}

	initialize();
});
app.controller("QuizSetupCtrl", function($scope, $rootScope, tests) {
	function initialize(){
		if (! $rootScope.currentTest){
			$rootScope.go("");
		} else {
		    $scope.test = $rootScope.currentTest;
			$scope.sectionData = tests.splitIntoSections($rootScope.currentTest);

			$scope.numberOfQuestions = "10";
			$scope.numberOfQuestionsOptions = {
			    "10": true,
			    "25": false,
			    "50": false,
			    "100": false,
			    "All": false
			}
			$scope.sections = {}
			for (var sectionName in tests.splitIntoSections($rootScope.currentTest)){
			    if ($scope.sectionData.hasOwnProperty(sectionName)) $scope.sections[sectionName] = true;
			}

			$scope.showAnswers = false;
			$scope.missedQuestions = true;
		}
	}

	$scope.cancel = function(){
	    $rootScope.go("");
	}

	$scope.setNumberOfQuestions = function(num){
	    $scope.numberOfQuestions = num;
	}

	$scope.toggleSection = function(sectionName){
	    $scope.sections[sectionName] = !($scope.sections[sectionName])
	}

	$scope.toggleNumberOfQuestionsOptions = function(option){
	    $scope.numberOfQuestions = option
	    for (var opt in $scope.numberOfQuestionsOptions){
	        if (opt === $scope.numberOfQuestions) $scope.numberOfQuestionsOptions[opt] = true
	        else $scope.numberOfQuestionsOptions[opt] = false
	    }
	}

	$scope.cancel = function(){
	    $rootScope.go("");
	}

	$scope.start = function(){
	    console.log("Starting quiz:")
        console.log("Number of questions: " + $scope.numberOfQuestions)
        console.log("Sections: " + JSON.stringify($scope.sections))
        console.log("Show answers: " + $scope.showAnswers)
        console.log("Favor missed questions: " + $scope.missedQuestions)

        var quizConfig = {
            showAnswers: $scope.showAnswers,
            missedQuestions: $scope.missedQuestions,
            questions: []
        };

        var totalQuestions = []
        for (var sectionName in $scope.sections){
            if ($scope.sections[sectionName]){
                $scope.sectionData[sectionName].forEach(function(question){
                    totalQuestions.push(question);
                })
            }
        }
        totalQuestions = tests.shuffle(totalQuestions)
        if ($scope.missedQuestions){
            totalQuestions.sort(function(a, b){
                return tests.calculatePercentageCorrectOnQuestion(a) - tests.calculatePercentageCorrectOnQuestion(b)
            })
        }
        var getNumOfQuestions = 0;
        if ($scope.numberOfQuestions === "All") getNumOfQuestions = totalQuestions.length
        else{
            try{
                getNumOfQuestions = parseInt($scope.numberOfQuestions)
            } catch (e){
                getNumOfQuestions = 10;
            }
        }
        if (getNumOfQuestions > totalQuestions.length) getNumOfQuestions = totalQuestions.length
        for (var i = 0; i < getNumOfQuestions; i++){
            quizConfig.questions.push(totalQuestions[i])
        }
        quizConfig.questions = tests.shuffle(quizConfig.questions)

        $rootScope.currentQuizConfig = quizConfig;

        $rootScope.go($rootScope.currentTestName + "/quiz")
    }

	initialize();
});