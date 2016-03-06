var app = angular.module("studyApp");
app.factory('tests', function($http) {
	var data = {};
	function all(success, failure){ $http.get("/study/all").then(success, failure); }
    function shuffle(array) {
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
	}
	function addStats(question, correct, success, failure){
        $http({
            method: "PUT",
            url: "/study/stats",
            params: {
                id: question.id,
                correct: correct
            }
        }).then(success, failure)
    }

	return {
	    getAllTests: function(callback){
	        if (data.all && callback){
	            callback(data.all);
	        } else if (data.all){
	            return data.all;
	        } else if (!data.all && !callback){
	            throw new Error("The data must first be retrieved asynchronously before it can be accessed synchronously");
	        } else {
	            all(function(testData){
	                data.all = testData.data;
	                callback(data.all)
	            }, function(error){
	                throw new Error("There was an error getting the data: " + error)
	            })
	        }
	    },
	    data: data,
	    addQuestion: function(question, success, failure){
	        $http.post("/study", question).then(success, failure)
	    },
	    updateQuestion: function(question, success, failure){
	        $http.put("/study", question).then(success, failure)
	    },
	    deleteQuestion: function(question, success, failure){
	        $http({
	            method: "DELETE",
	            url: "/study",
	            params: {
	                id: question.id
	            }
	        }).then(success, failure)
	    },
	    addStats: addStats,
	    gotQuestionRight: function(question){
            if (! question.totalAsked) question.totalAsked = 0;
            question.totalAsked += 1;
            if (! question.totalCorrect) question.totalCorrect = 0;
            question.totalCorrect += 1;
            addStats(question, true)
        },
        gotQuestionWrong: function(question){
            if (! question.totalAsked) question.totalAsked = 0;
            question.totalAsked += 1;
            if (! question.totalCorrect) question.totalCorrect = 0;
            addStats(question, false)
        },
        randomizeAnswers: function(question){
            var answers = [];
            answers.push(question.answer);
            for (var i = 0; i < question.other.length; i++){
                answers.push(question.other[i]);
            }
            return shuffle(answers);
        },
        splitIntoSections: function(test){
            var sections = {};
            for (var index in test){
                var q = test[index];
                if (! sections.hasOwnProperty(q.category)){
                    sections[q.category] = [];
                }
                sections[q.category].push(q);
            }
            return sections;
        },
        randomizeTestQuestions: function(){
            for (var key in data.all){
                if (data.all.hasOwnProperty(key)){
                    var test = data.all[key];
                    data.all[key] = shuffle(test);
                }
            }
        },
        shuffle: shuffle,
        calculatePercentageCorrectOnQuestion: function(question){
            if (! question.totalAsked || ! question.totalCorrect) return 0;
            else return question.totalCorrect / question.totalAsked
        }
	}
});