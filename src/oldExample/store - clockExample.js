import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const users = {
	state: {
		userArray: [{
			user: {
				firstName: 'Ryan',
				lastName: 'Chenkie',
				email: 'ryanchenkie@gmail.com',
				image: 'https://1.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=250'
			}
		}]
	},
	mutations: {}
}

const entries = {
	state: {
		//timeentries: [user: {firstName: 'fname', lastName: 'lname', email: 'email@email', image: 'url'}, comment: 'words', totalTime: 1.5, date: 'yyyy-mm-dd']
		//Might have to start with timeEntries[] having the first entry.
		timeEntries: [{
			user: {
				firstName: 'Ryan',
				lastName: 'Chenkie',
				email: 'ryanchenkie@gmail.com',
				image: 'https://1.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=250'
			},
			comment: 'First time entry',
			totalTime: 1.5,
			date: '2016-04-08'
		}],
		existingEntry: {
			comment: 'First time entry',
			totalTime: 1.5,
			date: '2016-04-08'
		}
	},
	mutations: {
		saveEntry (store, timeEntry) {
			//let index = users.state.userArray.indexOf(Variable)
			var tempEntry = Object.assign({}, users.state.userArray[0], timeEntry)
			entries.state.timeEntries.push(tempEntry)
			this.tempEntry = {}

		},
		deleteTimeEntry (store, timeEntry) {
			let index = entries.state.timeEntries.indexOf(timeEntry)
			entries.state.timeEntries.splice(index, 1)
		},
		timeUpdate (store, timeEntry) {
			//this was an event in the .VUE ==> Might have to move to a getter?
			entries.state.timeEntries.push(timeEntry)
			return true
		}
	}
}

const store = new Vuex.Store ({
	modules: {
		user: users,
		entry: entries
	}
})

//store.state.user => users state
//store.state.entry => entries state
//store.state.a // -> `moduleA`'s state
//store.state.b // -> `moduleB`'s state

/*
var store = new Vuex.Store ({
	state: {
		//We want to start with an existing time entry
		timeEntries: [{
			user: {
				firstName: 'Ryan',
				lastName: 'Chenkie',
				email: 'ryanchenkie@gmail.com',
				image: 'https://1.gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=250'
			},
			comment: 'First time entry',
			totalTime: 1.5,
			date: '2016-04-08'
		}],
		//Start out with the existing entry
		//by placing it in the array
	},
	mutations: {
		deleteTimeEntry (state, timeEntry) {
			let index = state.timeEntries.indexOf(timeEntry)
			state.timeEntries.splice(index, 1)
		},
		timeUpdate (state, timeEntry) {
			state.timeEntries.push(timeEntry)
			return true
		}
	}
})
*/
export default store