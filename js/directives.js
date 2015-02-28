var app = angular.module("studyApp");
/*
This directive allows you to pass a function in on an enter key to do what you want
*/
app.directive('ngEnter', function () {
	return function (scope, element, attrs) {
		element.bind("keydown keypress", function (event) {
			if(event.which === 13) {
				scope.$apply(function (){
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});

app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});

app.directive("question", function(){
	return {
		templateUrl: "html/question.html"
	};
});

app.directive("answer", function(){
	return {
		templateUrl: "html/answer.html"
	};
});