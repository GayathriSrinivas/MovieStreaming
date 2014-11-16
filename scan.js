var mdb = require('moviedb')('fb92666a2288e824aaa575b983c6e182');
var fs = require('fs');
var databaseUrl = "moviedb"; // "username:password@example.com/mydb"
var collections = ["movie"]
var db = require("mongojs").connect(databaseUrl, collections);
var folder;

function getFolderPath() {
	var folderPath = "";
	process.argv.forEach(function (val, index, array) {
		if(index == 2) {
			folderPath = val;
		}
	});
	folder = folderPath;
	return folderPath;
}

function printFileNamesInFolder(folderPath) {
	fs.readdir(folderPath, readdirCallback);
}

function readdirCallback(err,files) {
	if(err !== null){
		console.log(err);
	} else {
		for( var i in files) {
			console.log(files[i]);
			processFileName(files[i]);
		}
	}
}

/*
Input - File name rules : Movie Name (Year).Extension
Output - JSON of moviename and Year

*/
function parse (fileName) {
	var movieName = "";
	var movieYear = "";

	var arr = fileName.split("(");
	var movieInput = {
		name : arr[0].trim(),
		year : arr[1].split(")")[0]
	};

	console.log("in parse: filename: " + fileName + " year: " + movieInput.year);

	return movieInput;
}

function processFileName (fileName) {
	var movieInput = parse(fileName);

	mdb.searchMovie({query: movieInput.name }, function(err, res){

	  for(var i = 0 ; i < res.results.length ; i++) {

	  	var release_date = res.results[i].release_date;
		var release_year = release_date.split("-")[i];

	  	if( i == 0) {
	  		console.log(res.results[0]);
	  		console.log("input: " + fileName + " parsed year: " + movieInput.year);
	  		console.log("input: " + fileName + " api year: " + release_year);
	  	}
	  	
		if(release_year == movieInput.year) {
			/*
			db.movie.save(res.results[i], function(err, saved) {
			  if( err || !saved ) console.log("Movie not saved");
			  else console.log("Movie saved");
			}); */
			res.results[i].fileName = folderPath + "/" + fileName;
			db.movie.save(res.results[i]);
			//db.close()
			console.log("years are the same for " + fileName);
			break;
		}
	  }	
	}); 
}


var folderPath = getFolderPath();
printFileNamesInFolder(folderPath);

