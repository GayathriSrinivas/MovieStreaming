var express = require('express');
var app = express();
var databaseUrl = "moviedb"; // "username:password@example.com/mydb"
var collections = ["movie","genre","translations","reviews","trailers"];
var db = require("mongojs").connect(databaseUrl, collections);

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
		videoUrl : "/raw_omvie/" + id,
		vidoeDesc : "Ice Age !!"
	}
	res.send(JSON.stringify({movie_details : movie_details}));
	//res.send("Hello World ID ", id);
});

// return movie trailers
app.get('/trailers/:id', function(req,res){
	var movieId = req.params.id;

	db.trailers.find({id: parseInt(movieId)} ,function(err,data){
		res.send(JSON.stringify({movies : data[0]} ));
	});
});

app.get('/raw_movie/:id', function(req,res){
	var movieId = req.params.id;
	var path = "/home/gayathri/movies/Ice Age (2002).mp4"
	res.send(read(path));
	db.movie.find({id: movieId} ,function(err,data){
		console.log("-------------",data);
		res.send(JSON.stringify({movies : data} ));

	});
});	

app.get('/movie/:id', function(req,res){
	var movieId = req.params.id;
	var searchId = '{' + '"id"' + ':' + movieId + '}';
	db.movie.find(JSON.parse(searchId) ,function(err,data){
		console.log("-------------",data);
		res.send(JSON.stringify({movies : data} ));

	});
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

app.get('/reviews/:id',function (req,res){
	var movieId = req.params.id;
	var searchId = '{' + '"id"' + ':' + movieId + '}';
	db.reviews.find(JSON.parse(searchId),function(err,data){
		console.log(data);
		res.send(JSON.stringify({translations:data}));
	});
});

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

