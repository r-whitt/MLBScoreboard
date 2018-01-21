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
					console.log("previousRequest: " + previousRequest.length)
				}
				
			}).then(response => {
				console.log("url: " + url + "\n" + "response is: " + JSON.stringify(response.body))
				scores.state.dailyScores = response.body.data.games.game
				//length = scores.state.dailyScores.length
				console.log("Scores State dailyScores length: " + scores.state.dailyScores.length)
			}, response => {
				console.log("vue resource had an error: " + url + "\n" + "response is: " + response)
			})
		},
		updateScoreboard2 (store) {

		},
		updateDatePicker (store, timeObject) {
			scores.state.dateObject.year = timeObject.getFullYear();
			scores.state.dateObject.month = timeObject.getMonth() + 1;
			scores.state.dateObject.day = timeObject.getDate();
			console.log("Store date: " + scores.state.dateObject.month + "\ " + scores.state.dateObject.day + "\ " + scores.state.dateObject.year)
			console.log("datePicker about to fetch new scores")
			scores.mutations.updateScoreboardNew()
		},
		updateDate(store, timeObject) {
			scores.state.dateObject.year = timeObject.year,
			scores.state.dateObject.month = timeObject.month,
			scores.state.dateObject.day = timeObject.day
		}
	}
}

var teamInfo = {
	state: {},
	mutations: {}
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