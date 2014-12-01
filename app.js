var mdb = require('moviedb')('fb92666a2288e824aaa575b983c6e182');
var express = require('express');
var app = express();
var databaseUrl = "moviedb"; // "username:password@example.com/mydb"
var collections = ["movie","genre","translations","reviews","images","similar","toprated"];
var db = require("mongojs").connect(databaseUrl, collections);
var us = require("underscore");
app.use(express.static(__dirname + '/static'));


app.get('/movies', function (req, res) {
	db.movie.find({} ,function(err,data){
		console.log("-------------",data.length);
		res.send(JSON.stringify({movies : data} ));

	});
});

app.get('/movies/:id', function(req,res){
	var id = req.params.id;
	var movie_details = {
		videoUrl : "/raw_movie/" + id,
		vidoeDesc : "Ice Age !!"
	}
	res.send(JSON.stringify({movie_details : movie_details}));
	//res.send("Hello World ID ", id);
});

app.get('/raw_movie/:id', function(req,res){
	var movieId = req.params.id;
//	var path = "/home/gayathri/movies/Ice Age (2002).mp4"
//	res.send(read(path));
	db.movie.find({id: movieId} ,function(err,data){
		console.log("-------------",data);
		res.send(JSON.stringify({movies : data} ));

	});
});	

// return movie information according to particular locale
app.get('/movie/:id/:lang',function(req,res){
	var movieId = req.params.id;
	var lang = req.params.lang;
	var searchId = '{' + '"id":' + movieId  + ',"language":"' + lang + '"}';
	console.log(searchId);
	mdb.movieInfo(JSON.parse(searchId), function(err,data){
		console.log(data);
		var d = [];
		d.push(data);
		res.send(JSON.stringify({movies: d}));
	})
});

//returns all the genres present in movie database
app.get('/allgenres',function(req,res) {
	db.genre.find({},function(err,data){
		console.log(data);
		if(err){
			console.log("Error getting all genres..!");
			console.log(err);
		}
		res.send(JSON.stringify({genre: data}));
	});

});

//returns the list of genres on disk
app.get('/genresOnDisk', function(req,res){
	db.movie.find({}, function(err,data){
		var numOfMovies = data.length;
		var allGenres = [];
		for (var i=0;i< numOfMovies;i++){
			var numGenres = data[i].genres.length;
			for (var j=0;j< numGenres;j++){
				allGenres.push(data[i].genres[j].name);
			}
	 	//console.log(data[i].genres.length);
		}
	var unique = allGenres.filter(function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	});
		//console.log(allGenres);
		res.send(JSON.stringify({genres: unique}));
		console.log(unique);
	})
});

//returns all the movies in particular genre on disk
//Input - genre id
//output find the movies from movie collection and returns as json data
app.get('/genre/:id',function(req,res){
	var genreId = req.params.id;
	var searchId = '{' + '"genres.id"' + ':' + genreId + '}';
    console.log(searchId);
	db.movie.find(JSON.parse(searchId) ,function(err,data){
		console.log(data);
		res.send(JSON.stringify({genrem: data}));
	});
});

//input - movie id
app.get('/translations/:id', function (req,res) {
	var movieId = req.params.id;
	var searchId = '{' + '"id"' + ':' + movieId + '}';
 	db.translations.find(JSON.parse(searchId),function(err,data){
		console.log(data);
		res.send(JSON.stringify({translations:data}));
	});
});

//this api returns the reviews for particular movie
app.get('/reviews/:id',function (req,res){
	var movieId = req.params.id;
	var searchId = '{' + '"id"' + ':' + movieId + '}';
	db.reviews.find(JSON.parse(searchId),function(err,data){
		console.log(data);
		res.send(JSON.stringify({translations:data}));
	});
});

//this api returns posters for a specific movie and specific language
//input sample url:- http://127.0.0.1:3000/movie/posters/45269/fr
/*
* There can be more than one poster for any movie and language of different dimensions.
* The front end designer has to choose among many different dimensions available
* */
app.get('/movie/posters/:id/:lang', function(req,res){
	var movieId = req.params.id;
	var lang = req.params.lang;
	var searchId = '{' + '"id"' + ':' + movieId + '}';
	db.images.find(JSON.parse(searchId),function(err,data){
		//var data1 = 'data:'+data;
		var result =[];
		var j=0;
		var posters = data[0].posters;
		for(var i=0;i< posters.length;i++ ){
			if (posters[i].iso_639_1 === lang){
				result[j] = posters[i];
				j++;
			}
		}
		res.send(JSON.stringify({posters:result}))
	});
});

/*
* This api will return all the similar movies for a given movie id
 */

app.get('/movie/similar/:id', function(req,res){
	var movieId = req.params.id;
	var searchId = '{' + '"id"' + ':' + movieId + "}";
	console.log(searchId);
	db.similar.find(JSON.parse(searchId),function(err,data){
	/*	var result = [];
		for(var i=0;i< data.length;i++){
			result[i] = data[0].results;
		}
	*/
			res.send(JSON.stringify({similar:data[0].results}));
	});
});
/*
* This api will get the  top rated movies
 */
app.get('/movie/toprated', function(req,res){
	db.toprated.find({}, function(err,data){
		console.log(data);
		res.send(data);
	});
});

/*app.get('/movie/id', function(req,res){

});*/


var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

