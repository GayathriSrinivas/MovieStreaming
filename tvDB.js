var databaseUrl = 'mongodb://localhost:27017/moviedb';
var collections = ["tvShow","tvEpisodes","tvSeasons","tvShowCollection"];
var mongodb = require("mongojs").connect(databaseUrl, collections);

module.exports = {

	saveTvShow : function (tvShow) {
		mongodb.tvShow.save(tvShow);
	},

	saveTvSeasons : function (season) {
		mongodb.tvSeasons.save(season);
	},

	saveTvEpisodes : function (episode) {
		mongodb.tvEpisodes.save(episode);
	},

	saveTvCollection : function(collections) {
		mongodb.tvShowCollection.save(collections);
	}

};
