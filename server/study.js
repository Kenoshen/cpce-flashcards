module.exports = function (){
	var mongoose = require('mongoose');
	var db = mongoose.model("Study", new mongoose.Schema({}, {strict: false}), "study");

	function now() {
		var d = new Date();
		return (((d.getUTCMonth()+1) < 10)?"0":"") + (d.getUTCMonth()+1) +"/" + 
		((d.getUTCDate() < 10)?"0":"") + d.getUTCDate() +"/"+ d.getUTCFullYear() + " " + 
		((d.getUTCHours() < 10)?"0":"") + d.getUTCHours() +":"+ 
		((d.getUTCMinutes() < 10)?"0":"") + d.getUTCMinutes() +":"+ 
		((d.getUTCSeconds() < 10)?"0":"") + d.getUTCSeconds() + " GMT";
	}

	function defragment(data){
		var results = {};
		for (var i = 0; i < data.length; i++){
			var row = JSON.parse(JSON.stringify(data[i]));
			if (!(results[row.test])){
				results["" + row.test] = [];
			}
			if (!(row.other)){
				row.other = [];
			}
			if (!(row.difficulty)){
				row.difficulty = 0;
			}
			results[row.test].push(row);
		}
		return results;
	}

	function getAll(callback){
		db.find({$query:{}, $orderby:{_inserted: -1}}, function(err, data){
			callback(defragment(data));
		});
	}

    function getAllTestNames(callback){
        db.find({$query: {}}, function(err, data){
            var testsObj = {};
            data.forEach(function(row){
                if (! testsObj[row.test]) testsObj[row.test] = 1;
                else testsObj[row.test] += 1;
            });
            var tests = [];
            for (var testName in testsObj){
                if (testsObj.hasOwnProperty(testName)){
                    tests.push({name: testName, count: testsObj[testName]});
                }
            }
            callback(tests);
        });
    }

    function getTestCategories(testName, callback){
        db.find({$query: {test: testName}}, function(err, data){
            var categoriesObj = {};
            data.forEach(function(row){
                if (! categoriesObj[row.category]) categoriesObj[row.category] = 1;
                else categoriesObj[row.category] += 1;
            });
            var categories = [];
            for (var categoryName in categoriesObj){
                if (categoriesObj.hasOwnProperty(categoryName)){
                    categories.push({name: categoryName, count: categoriesObj[categoryName]});
                }
            }
        })
    }


	function add(body, callback){
		var insert = new db(body);
		insert.save(function(err, data){
			if (err){
				console.log("Error... " + JSON.stringify(err));
				callback({});
			} else {
				getAll(callback);
			}
		});
	}

	function update(body, callback){
		db.update({_id: body._id}, body, {}, function(err, data){
			if (err){
				console.log("Error... " + JSON.stringify(err));
				callback({});
			} else {
				getAll(callback);
			}
		});
	}

	function remove(id, callback){
		db.findOne({_id: id}).remove(function(err, data){
			if (err){
				console.log("Error... " + JSON.stringify(err));
				callback({});
			} else {
				getAll(callback);
			}
		});
	}

	function stats(id, correct){
		db.findOne({_id: id}, function(err, data){
			if (!(err) && data){
				var body = JSON.parse(JSON.stringify(data));
				if (!(body.totalAsked)){
					body.totalAsked = 0;
				}
				body.totalAsked += 1;
				if (!(body.totalCorrect)){
					body.totalCorrect = 0;
				}
				if (correct === "true"){
					body.totalCorrect += 1;
				}
				delete body['_inserted'];
				body['_updated'] = now();
				update(body, function(results){});
			}
		});
	}

	return { use: function(rootPath, vHost){
		vHost.get(rootPath + "/all", function(req, res, next){
			getAll(function(results){
				res.send(results);
			});
		});

		vHost.post(rootPath, function(req, res, next){
			var body = JSON.parse(JSON.stringify(req.body));
			delete body["_id"];
			body['_inserted'] = now();
			body['_updated'] = now();
			add(body, function(results){
				res.send(results);
			});
		});

		vHost.put(rootPath, function(req, res, next){
			var body = JSON.parse(JSON.stringify(req.body));
			delete body['_inserted'];
			body['_updated'] = now();
			update(body, function(results){
				res.send(results);
			});
		});

		vHost.delete(rootPath, function(req, res, next){
			var id = req.query.id;
			remove(id, function(results){
				res.send(results);
			});
		});

		vHost.put(rootPath + "/stats", function(req, res, next){
			var id = req.query.id;
			var correct = req.query.correct;
			stats(id, correct);
			res.send();
		});
	}};
}();
