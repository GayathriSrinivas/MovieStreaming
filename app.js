var express = require('express');
var app = express();
var databaseUrl = "moviedb"; // "username:password@example.com/mydb"
var collections = ["movie"];
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
		videoUrl : "/raw_movie/" + id,
		vidoeDesc : "Ice Age !!"
	}
	res.send(JSON.stringify({movie_details : movie_details}));
	//res.send("Hello World ID ", id);
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

app.get('/genre/findAll') {
	return all the genre present 
}


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})

