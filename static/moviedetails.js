$( document ).ready(function() {
    
	getMovie();
	var id = window.location.href.split("#")[1];
	var url = "/trailer.html#" + id;
	console.log("url:"+url);
	$("#movieTrailerLink").attr('href',url);
	//getMovieList();
});

function getMovie(){
	var id = window.location.href.split("#")[1];
	var url = "/movie/" + id;
	$.get(url,function(data){
		var movies = JSON.parse(data);
		movies = movies.movies;;
		$("#movie_poster").attr('src',"http://image.tmdb.org/t/p/w300"+movies[0].poster_path );
		$("#movie_title").text(movies[0].original_title);
		$("#movie_desc").text(movies[0].overview);
		//production_house language_set
		$("#release_date").text(movies[0].release_date);
		$("#runtime").text(movies[0].runtime+" mins");
		var genreSet = movies[0].genres;
		for(var i=0;i<genreSet.length;i++){		
			var genreValue = " ";
			genreValue += genreSet[i].name;
			$("#genre_set").append(genreValue);
		}
		var prodCompSet = movies[0].production_companies;
		for(var i=0;i<prodCompSet.length;i++){		
			var prodCompValue = " ";
			prodCompValue += prodCompSet[i].name;
			$("#production_house").append(prodCompValue);
		}
		var langSet = movies[0].spoken_languages;
		for(var i=0;i<langSet.length;i++){		
			var langValue = " ";
			langValue += langSet[i].name;
			$("#language_set").append(langValue);
		}
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
		$('#movieVideo').get(0).play();
		console.log("Dec....",movies.vidoeDesc);
	});
}


