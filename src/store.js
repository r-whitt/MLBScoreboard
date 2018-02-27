import Vuex from 'vuex';
import Vue from 'vue';
import VueResource from 'vue-resource'
//import score from './js/mlbApp/score.js'
Vue.use(VueResource)

//import mlb from './js/mlbApp/app.js'

Vue.use(Vuex)

var store = new Vuex.Store ({
	state: {
		data: {
			message: 'Test Message',
			scores: [],
			year: "2017",
			month: "07",
			day: "15"
		}
	},
	mutations: {
		updateState(state, message){
			state.data.message += message
		},
		/*
		updateScores (year, month, day, callback) {
			state.data.scores = getMasterScoreboard(year, month, day)
		}
		*/
	}
})


var scores = {
	state: {
		message: 'Test Message-New Store',
		messageArray: [
			{id: 1, message: "1st message", show: true},
			{id: 2, message: "2nd message", show: false}
		],
		dailyScores: [],
		dateObject: {
			year: "2017",
			month: "07",
			day: "15"
		},
		storeTempDate: new Date()
	},
	getters: {
		messageFilter (state) {
			return scores.state.messageArray.filter(message => message.show)
		}
	},
	mutations: {
		udpateState(store, message) {
			scores.state.message += message
		},
		updateScoreboardNew (store) {
			//Uses the new date to configure URL and update api call for scoreboard
			var url = ("http://gd2.mlb.com/components/game/mlb/year_" + scores.state.dateObject.year + "/month_" + scores.state.dateObject.month + "/day_" + scores.state.dateObject.day + "/master_scoreboard.json")
			console.log("URL is: " + url) 
			var previousRequest = ""
			Vue.http.get(url, {
				before(request) {
					if(previousRequest.length > 0) {
						previousRequest.abort();
						console.log("ABORTED previous request")
					}
					previousRequest = JSON.stringify(request)
					//console.log("previousRequest: " + previousRequest.length)
				}
				
			}).then(response => {
				console.log("url: " + url)
				//console.log("url: " + url + "\n" + "response is: " + JSON.stringify(response.body))
				scores.state.dailyScores = response.body.data.games.game
				//length = scores.state.dailyScores.length
				//console.log("Scores State dailyScores length: " + scores.state.dailyScores.length)
			}, response => {
				console.log("vue resource had an error: " + url + "\n" + "response is: " + response)
			})
		},
		resetTeamIndexes () {
			teamInfo.state.teamArray.forEach(function(element) {
				element.startingIndex = 0;
				element.endingIndex = 9;
				element.starting = true;
			})
		},
		updateDatePicker (store, timeObject) {
			//Used with the Datepicker v:on=closed
			scores.state.dateObject.year = timeObject.getFullYear();
			var tempMonth = timeObject.getMonth() + 1;
			var tempDay = timeObject.getDate();
			scores.state.dateObject.month = tempMonth > 9 ? tempMonth : "".concat(0, tempMonth)
			//console.log("Month is: " + scores.state.dateObject.month + "TempDay is: " + tempDay)
			scores.state.dateObject.day = tempDay > 9 ? tempDay : "".concat(0, tempDay)
			//console.log("Day is: " + scores.state.dateObject.day + "tempDay is: " + tempDay)
			//console.log("Store date: " + scores.state.dateObject.month + "\ " + scores.state.dateObject.day + "\ " + scores.state.dateObject.year)
			//console.log("datePicker about to fetch new scores")
			scores.mutations.resetTeamIndexes()
			scores.mutations.updateScoreboardNew()
		},
		updateDate(store, timeObject) {
			//Used with no datepicker (save button)
			scores.state.dateObject.year = timeObject.getFullYear(),
			scores.state.dateObject.month = timeObject.getMonth() + 1,
			scores.state.dateObject.day = timeObject.getDate()
		}
	}
}

var teamInfo = {
	state: {
		teamArray: [
			{ "name": "Yankees", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Red Sox", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Blue Jays", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Tigers", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Cubs", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Orioles", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Cardinals", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Pirates", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "D-backs", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Braves", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Rockies", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Mets", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Dodgers", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Marlins", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Twins", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Astros", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Phillies", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Brewers", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Mariners", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "White Sox", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Nationals", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Reds", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Rangers", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Royals", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Giants", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Padres", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Indians", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Athletics", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Rays", "startingIndex": 0, "endingIndex": 9, "starting": true },
			{ "name": "Angels", "startingIndex": 0, "endingIndex": 9, "starting": true }
		]
	},
	mutations: {
		updateTeamIndex(store, teamObject) {
			if(teamObject.hasOwnProperty('startIndex')) {
				teamInfo.state.teamArray[teamObject.awayTeamIndex].startingIndex = teamObject.startIndex
				teamInfo.state.teamArray[teamObject.awayTeamIndex].endingIndex = teamObject.endingIndex
				teamInfo.state.teamArray[teamObject.homeTeamIndex].startingIndex = teamObject.startIndex
				teamInfo.state.teamArray[teamObject.homeTeamIndex].endingIndex = teamObject.endingIndex
			}
		},
		showLateInning(store, teamIndex2Obj) {
			teamInfo.state.teamArray[teamIndex2Obj.awayTeamIndex].startingIndex += 1
			teamInfo.state.teamArray[teamIndex2Obj.awayTeamIndex].endingIndex += 1
			teamInfo.state.teamArray[teamIndex2Obj.homeTeamIndex].startingIndex += 1
			teamInfo.state.teamArray[teamIndex2Obj.homeTeamIndex].endingIndex += 1
		},
		showEarlyInning(store, team3Object) {
			teamInfo.state.teamArray[team3Object.awayTeamIndex].startingIndex -= 1
			teamInfo.state.teamArray[team3Object.awayTeamIndex].endingIndex -= 1
			teamInfo.state.teamArray[team3Object.homeTeamIndex].startingIndex -= 1
			teamInfo.state.teamArray[team3Object.homeTeamIndex].endingIndex -= 1
		}
	}
}

var store = new Vuex.Store ({
	modules: {
		score: scores,
		team: teamInfo
	}
})
//To Call in another app, import then store.state && 
//v-for data in your new computed function & tag {{data.message}}

//store.state.entry.data --> how to call in another componenet, like App.vue
export default store