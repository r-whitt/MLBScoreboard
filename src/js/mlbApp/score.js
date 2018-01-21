var request = require('request')
var jsonfile = require('jsonfile')
var async = require('async')
var moment = require('moment');
var _ = require('lodash');
var moment = require('moment');

function getMasterScoreboard (year, month, day, callback) {
	var uri = ("http://gd2.mlb.com/components/game/mlb/year_" + state.data.year + "/month_" + state.data.month + "/day_" + state.data.day + "/master_scoreboard.json")
	request({uri, json: true}, function(error, response, body) {
		if(error) {

		} else if (response.statusCode !== 200) {

		} else {
			console.log("getMasterScoreboard found a body")
			console.log("URL: " + uri)
			var data = body.data.games
			return data
		}
	})
}

module.exports = getMasterScoreboard()