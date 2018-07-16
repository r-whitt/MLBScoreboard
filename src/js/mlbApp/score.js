const request = require('request');

function getMasterScoreboard (year, month, day, callback) {
  const uri = ("http://gd2.mlb.com/components/game/mlb/year_" + state.data.year + "/month_" + state.data.month + "/day_" + state.data.day + "/master_scoreboard.json");
	request({uri, json: true}, function(error, response, body) {
		if(error) {

		} else if (response.statusCode !== 200) {

		} else {
			console.log("getMasterScoreboard found a body");
			console.log("URL: " + uri);
			return body.data.games
		}
	})
}

module.exports = getMasterScoreboard();
