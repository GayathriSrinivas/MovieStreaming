var mdb = require('moviedb')('fb92666a2288e824aaa575b983c6e182');
var fs = require('fs');
//var request = require('request');
//var databaseUrl = "moviedb"; // "username:password@example.com/mydb"
var databaseUrl = 'mongodb://localhost:27017/moviedb';
var collections = ["movie","genre","translations","reviews","images"]
var db = require("mongojs").connect(databaseUrl, collections);
var folder;

function getFolderPath() {
    var folderPath = "";
    process.argv.forEach(function (val, index, array) {
        if (index == 2) {
            folderPath = val;
        }
    });
    folder = folderPath;
    return folderPath;
}

function printFileNamesInFolder(folderPath) {
    fs.readdir(folderPath, readdirCallback);
}

function readdirCallback(err, files) {
    if (err !== null) {
        console.log(err);
    } else {
        for (var i in files) {
            console.log(files[i]);
            processFileName(files[i]);
        }
    }
}

/*
 Input - File name rules : Movie Name (Year).Extension
 Output - JSON of moviename and Year

 */
function parse(fileName) {
    var movieName = "";
    var movieYear = "";

    var arr = fileName.split("(");
    var movieInput = {
        name: arr[0].trim(),
        year: arr[1].split(")")[0]
    };

    console.log("in parse: filename: " + fileName + " year: " + movieInput.year);

    return movieInput;
}

function processFileName(fileName) {
    var movieInput = parse(fileName);

    mdb.searchMovie({query: movieInput.name}, function (err, res) {

        for (var i = 0; i < res.results.length; i++) {

            var release_date = res.results[i].release_date;
            var release_year = release_date.split("-")[i];

            if (i == 0) {
                console.log(res.results[0]);
                console.log("input: " + fileName + " parsed year: " + movieInput.year);
                console.log("input: " + fileName + " api year: " + release_year);
            }

            if (release_year == movieInput.year) {
                /*
                 db.movie.save(res.results[i], function(err, saved) {
                 if( err || !saved ) console.log("Movie not saved");
                 else console.log("Movie saved");
                 }); */
                //res.results[i].fileName = folderPath + "/" + fileName;

                //db.movie.save(res.results[i]);
                mdb.movieInfo({id: res.results[i].id},function(err,res){
                    console.log(res);
                    db.movie.save(res);
                });



                //retrieve and store list of available translations
                mdb.movieTranslations({id: res.results[i].id},function(err,res){
                    console.log(res);
                    db.translations.save(res);
                });

                //retrieve and store all available images(backdrop and posters) for specific movie
                mdb.movieImages({id: res.results[i].id }, function(err,res) {
                    console.log(res);
                    db.images.save(res);
                });

                //db.close()
                console.log("years are the same for " + fileName);

                mdb.movieReviews({id:res.results[i].id},function(err,res){
                    console.log(res);
                    db.reviews.save(res);
                });
                break;
            }
            db.close();
        }
    });
}
//this method gets all the genres present and stores it in mongodb
function getAllGenre() {
    mdb.genreList({}, function (err, res) {
        for (var i=0;i< res.genres.length;i++){
            //console.log(res);
            db.genre.save(res.genres[i], function(err, saved){
                if(err || !saved) {
                    console.log("Error.Genre not updated in collection!!");
                    console.log(err);
                    db.close();
                }
                else
                    console.log("Genre updated in database");
            //db.close
            });
        }
          //  console.log("hello", res);
    });
}

//this method returns all the translations available for movie
function getTranslationsForMovie() {

}

var folderPath = getFolderPath();
getAllGenre();
printFileNamesInFolder(folderPath);

