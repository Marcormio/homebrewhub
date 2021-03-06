// cronjob / git hook
//  node sync.js

var mongoose = require('mongoose');
var fs = require('fs');
var games = JSON.parse(fs.readFileSync('database/gamesList.json', 'utf8'));
var c = 0

dbURL = 'mongodb://localhost:27018/passport'
dbOptions = {
	useMongoClient : true
}
mongoose.connect(dbURL, dbOptions)

var Game = require('./app/models/game');

games.forEach(function(permalink, index) {
	var game = JSON.parse(fs.readFileSync('database/entries/'+permalink+'/game.json', 'utf8'));
	
	if (game["onlineplay"] == null)
		game["onlineplay"] = true
	
	Game.findOneAndUpdate({
			'data.permalink': permalink
		}, 
		// TODO: use same values array for udpate and create
		// Find the matching entry and update it
		{
			'data.title' : game["title"],
			'data.permalink' : game["slug"],
			'data.developer' : game["developer"],
			'data.typetag' : game["typetag"],
			'data.platform' : game["platform"],
			'data.rom' : game["rom"],
			'data.screenshots' : game["screenshots"],

			'data.license' : game["license"],
			'data.assetLicense' : game["assetLicense"],
			'data.description' : game["description"],
			'data.video' : game["video"],
			'data.date' : game["date"],
			'data.tags' : game["tags"],
			'data.alias' : game["alias"],
			'data.repository' : game["repository"],
			'data.gameWebsite' : game["gameWebsite"],
			'data.devWebsite' : game["devWebsite"],
			'data.onlineplay' : game["onlineplay"],
			'data.wip' : game["wip"],
			'data.files' : game["files"]
			
		}, function(err, result) {
			if (err) {
				console.log("Error", err)
			}
			else if (!result) {
				// No game with that permalink, create a new entry
				var newGame = new Game({
					 'data.title': game["title"],
					 'data.permalink': game["slug"],
					 'data.developer': game["developer"],
					 'data.typetag': game["typetag"],
					 'data.platform': game["platform"],
					 'data.rom': game["rom"],
					 'data.screenshots': game["screenshots"],

					 'data.license': game["license"],
					 'data.assetLicense': game["assetLicense"],
					 'data.description': game["description"],
					 'data.video': game["video"],
					 'data.date': game["date"],
					 'data.tags': game["tags"],
					 'data.alias': game["alias"],
					 'data.repository': game["repository"],
					 'data.gameWebsite': game["gameWebsite"],
					 'data.devWebsite': game["devWebsite"],
					 'data.onlineplay': game["onlineplay"],
					 'data.wip' : game["wip"],
					 'data.files' : game["files"]
				})
				c=c+1
				newGame.save();
				console.log("Added", game["title"])
				if (c==games.length) mongoose.disconnect()
			}
			else {
				c=c+1
				
				console.log("Updated", game["title"])
				// kinda foreach callback? maybe there's a better way?
				if (c==games.length) mongoose.disconnect()
			}
		})
})
