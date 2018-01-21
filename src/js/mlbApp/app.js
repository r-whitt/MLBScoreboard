var jsonfile = require('jsonfile')
var async = require('async')
var request = require('request');
var moment = require('moment');
var _ = require('lodash');
var moment = require('moment');

var config = {
	protocol: "http://",
	baseURL: "gd2.mlb.com/components/game/mlb/"
}

//used to input in the URL to get appropriate date
var mlbDate = {
	year: "2017",
	month: "07",
	day: "15"
}

if(mlbDate.month.length != 2) {
	return console.log("Month isn't proper size. Ex: January = 01 " + mlbDate.month)
}

if(mlbDate.day.length != 2){
	return console.log("Day isn't proper size. Ex: 1st = 01")
}

//Path to config file that will be loaded
var configFile = './config.json'

//Verifying config is populated 
try {
    var loadedConfig = jsonfile.readFileSync(configFile, { throws: true });
    config = _.defaults(loadedConfig, config);
} catch(e) {
    console.log('ERROR LOADING config.json -- make sure it exists ', e)
}

if(!config) {
    console.log('No config file found at: ' + configFilePath)
}

console.log("Config setup is: " + '\n' + JSON.stringify(config))

//Getting the master_scoreboard.json from MLB.com
//Sample URL: http://gd2.mlb.com/components/game/mlb/year_2017/month_07/day_15/master_scoreboard.json
var data = null
function getMasterScoreboard (date, callback) {
	var uri = (config.protocol + config.baseURL + "year_" + mlbDate.year + "/month_" + mlbDate.month + "/day_" + mlbDate.day + "/master_scoreboard.json")
	request({uri, json: true}, function(error, response, body) {
		if(error) {
			console.log("Error in getMasterScoreboard " + '\n' + "URL: " + uri + '\n' + "Error is: " + error)
		} else if (response.statusCode !== 200) {
			console.log("Response Code isn't 200 in getMasterScoreboard " + '\n' + "response statusCode is: " + response.statusCode + '\n' + "URL is: " + uri)
		} else {
			console.log("getMasterScoreboard found a body")
			/*
			var data = body.data.games
			console.log("data is: " + JSON.stringify(data))
			*/
			data = body.data.games
			/*
			async.each(data.game, showGames, function (err) {
				if(err) {
					console.log(err)
				} else {
					console.log("showing games successfully")
				}
			})*/
			//this needs to run some kind of asyn.each for data.games.game (is an Array)
			//Want per data.games.game object = home_team_name, away_team_name, home/awa_win, home/away_loss, gameback?, data.games.game[i].linescore.inning[i], ...linescore.e/r/h, game[i]home_runs (will need to use team_code to associate to team(home_code & away_code))
			//links?, winning/losing pitcher, save, data.games.game.status.top_inning = true for bottom of 9th (or extra IN) wasn't played, data.games.game.status.status for final, canceled, etc., use linescore.r to determine winning team for pitchers
			//can highlight interleague games by comparing home_league_id to away_league_id (104 = NL, 103=AL)
		}
	})
}

/*
function showGames (data) {
	console.log(JSON.stringify(data) + '\n\n')
}
*/

getMasterScoreboard(mlbDate)

console.log("data is: " + data)

module.exports = getMasterScoreboard2()