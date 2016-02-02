function Test(data){
    this._questionSortFunction = function(a, b){return a.score - b.score};
    this.questions = data.map(function(question){return new Question(question)}).sort(this._questionSortFunction);
    this.sections = [];
    this._generateSections = function(self){
        var tempSections = {};
        self.questions.forEach(function(question){
            if (! tempSections[question.section]) tempSections[question.section] = [question];
            else tempSections[question.section].push(question);
        });
        self.sections = [];
        for (var sectionName in tempSections){
            if (tempSections.hasOwnProperty(sectionName)) {
                var section = tempSections[sectionName];
                section.name = sectionName;
                self.sections.push(section)
            }
        }
    };

}
Test.prototype.shuffleAllAnswers = function(){
    this.questions.forEach(function(question){ question.shuffleAnswers() })
};
Test.prototype.addQuestion = function(question){
    question.shuffleAnswers();
    this.questions.push(question).sort(this._questionSortFunction);
    this._generateSections(this);
};

function Question(data){
    for (var key in data){ if (data.hasOwnProperty(key)) this[key] = data[key] }
    var tmpAnswers = [new Answer(this.answer, true)];
    this.others.forEach(function(wrongAnswer){ tmpAnswers.push(new Answer(wrongAnswer, correct)) });
    this.answers = tmpAnswers;
    if (this.totalAsked === null || this.totalAsked === undefined) this.totalAsked = 0;
    if (this.totalCorrect === null || this.totalCorrect === undefined) this.totalCorrect = 0;
    this.score = (this.totalAsked * 10) + ((this.totalCorrect / this.totalAsked) - 0.75) * 10
}
Question.prototype.shuffleAnswers = function(){
    for(var j, x, i = this.answers.length; i; j = Math.floor(Math.random() * i), x = this.answers[--i], this.answers[i] = this.answers[j], this.answers[j] = x){}
};

function Answer(text, correct){
    this.text = text;
    this.correct = correct;
}