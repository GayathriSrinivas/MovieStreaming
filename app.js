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
})

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})