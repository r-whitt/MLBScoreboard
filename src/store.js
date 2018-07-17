import Vuex from 'vuex'
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource);

Vue.use(Vuex);

const scores = {
  state: {
    message: "Test Message-New Store",
    noGame: false,
    loading: false,
    messageArray: [
      { id: 1, message: "1st message", show: true },
      { id: 2, message: "2nd message", show: false }
    ],
    dailyScores: [],
    allStarScore: [],
    storeTempDate: new Date(new Date().setDate(new Date().getDate())),
    dateObject: {
      full: new Date(new Date().setDate(new Date().getDate() - 1)),
      year: new Date(new Date().setDate(new Date().getDate() - 1)).getFullYear(),
      month: new Date(new Date().setDate(new Date().getDate() - 1)).getMonth() + 1,
      day: new Date(new Date().setDate(new Date().getDate() - 1)).getDate()
    },
    scoresURL: '',
  },
  getters: {
    messageFilter(state) {
      return scores.state.messageArray.filter(message => message.show);
    }
  },
  mutations: {
    updateState(store, message) {
      scores.state.message += message;
    },
    updateURL () {
      //verifying the month/day variables are the proper size
      const tempDay = parseInt(scores.state.dateObject.day, 10) //REmoves leading 0 when selecting new date
      const urlDay = tempDay < 10 ? "".concat(0, tempDay) : tempDay;
      const tempMonth = parseInt(scores.state.dateObject.month, 10) //Removes leading 0 when selecting new date
      const urlMonth = (tempMonth < 10) ? "".concat(0, tempMonth) : tempMonth;
      //Uses the new date to configure URL and update api call for scoreboard
      scores.state.scoresURL =
        "http://gd2.mlb.com/components/game/mlb/year_" +
        scores.state.dateObject.year +
        "/month_" +
        urlMonth +
        "/day_" +
        urlDay +
        "/master_scoreboard.json";
    },
    updateScoreboardNew(store) {
      scores.state.loading = true;
      scores.mutations.updateURL();
      let previousRequest = "";
      Vue.http
        .get(scores.state.scoresURL, {
          before(request) {
            if (previousRequest.length > 0) {
              previousRequest.abort();
              console.log("ABORTED previous request");
            }
            previousRequest = JSON.stringify(request);
          }
        })
        .then(
          response => {
            if (!response.body.data.games.game) {
              scores.state.noGame = true;
            } else if (response.body.data.games.game.length > 1) {
              scores.state.dailyScores = response.body.data.games.game;
            } else if (
              response.body.data.games.game.series === "MLB All-Star Game"
            ) {
              scores.state.allStarScore = response.body.data.games;
            } else {
              console.log("Store no UpdateScoreBoardNew didn't return a case");
            }
          },
          response => {
            console.log(
              "vue resource had an error: " + scores.state.scoresURL + "\n" + "response is: " + JSON.stringify(response)
            );
          }
        );
    },
    updateLoader(store, boolean) {
      console.log("vuex received: " + boolean);
      scores.state.loading = boolean;
    },
    resetTeamIndexes() {
      teamInfo.state.teamArray.forEach(function(element) {
        element.startingIndex = 0;
        element.endingIndex = 9;
        element.starting = true;
      });
    },
    clearScores(store) {
      scores.state.dailyScores = [];
      scores.state.allStarScore = [];
      scores.state.noGame = false;
    },
    updateDatePicker(store, timeObject) {
      scores.state.dateObject.full = timeObject
      scores.state.dateObject.year = timeObject.getFullYear();
      const tempMonth = timeObject.getMonth() + 1;
      const tempDay = timeObject.getDate();
      scores.state.dateObject.month =
        tempMonth > 9 ? tempMonth : "".concat(0, tempMonth);
      scores.state.dateObject.day =
        tempDay > 9 ? tempDay : "".concat(0, tempDay);
      scores.mutations.resetTeamIndexes();
      scores.mutations.clearScores();
      scores.mutations.updateScoreboardNew();
    },
    updateDate(store, timeObject) {
      //Used with no datepicker (save button)
      (scores.state.dateObject.year = timeObject.getFullYear()),
        (scores.state.dateObject.month = timeObject.getMonth() + 1),
        (scores.state.dateObject.day = timeObject.getDate());
    }
  }
};

const teamInfo = {
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
};

const store = new Vuex.Store ({
	modules: {
		score: scores,
		team: teamInfo
	}
});

export default store
