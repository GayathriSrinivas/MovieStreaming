

function getMovieList() {
	$.get('/movies',function(data){
		var movies = JSON.parse(data);
		movies = movies.movies;
		for (var i = 0 ; i<movies.length ; i++) {
			var wstr = "";
			wstr += "<li>";
			wstr += '<a href="/movie_details.html#' + movies[i].id + '">'
			wstr += movies[i].original_title;
			wstr += '</a>';
			wstr += "</li>";
			$("#moviesList").append(wstr);
		};
	});
}

function getMovieDetails() {
	var id = window.location.href.split("#")[1];
	var url = "/movies/" + id;
	 
	var videoUrl = '/videos/' + id + '.mp4';

	$.get(url,function(data){
		console.log("data", data);
		var movies = JSON.parse(data);
		movies = movies.movie_details;
		$("#movieDesc").html(movies.vidoeDesc);
		$("#movieVideo").html('<source src="' + videoUrl + '" type="video/mp4"></source>');
		$('#movieVideo').get(0).play()
		console.log("Dec....",movies.vidoeDesc)
	});
}