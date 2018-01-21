import Vuex from 'vuex';
import Vue from 'vue';
//import score from './js/mlbApp/score.js'


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

//To Call in another app, import then store.state && 
//v-for data in your new computed function & tag {{data.message}}

/* --> Use if you're using multiple store modules
const users = {
	state: {
		userArray: [{user: {firstName: 'Ryan',}}]
	},
	mutations: {}
}

const entries = {
	state: {},
	mutations: {
		functionsGoHere() {}
	}
}

const store = new Vuex.Store ({
	modules: {
		user: users,
		entry: entries
	}
})
//store.state.entry.data --> how to call in another componenet, like App.vue
*/
export default store