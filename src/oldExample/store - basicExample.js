/*
export default {
	state: {
		counter: 0
	}
}
*/

/* solution 3: 
var store = {
	state: {
		counter: 0
	},
	increment: function () {
		if(store.state.counter < 100) {
			store.state.counter += 1;
		}
	},
	reset: function () {
		store.state.counter = 0;
	}
}

export default store
*/
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

var store = new Vuex.Store ({
	state: {
		counter: 0,
		counter2: 0,
	},
	getter: {
		counterInitState (state) {
			return state.counter2
		}
	},
	mutations: {
		INCREMENT (state) {
			state.counter ++
		},
		INCREMENT2 (state) {
			state.counter2 ++
		},
		RESETALL (state) {
			state.counter = 0,
			state.counter2 = 0
		},
		RESET (state) {
			state.counter += -1
		},
		RESET1 (state) {
			state.counter2 = 0
		}
	}
})

export default store