<template>
	<div>
		<div v-for="scores in updateAllStarScore" id="dailyScoreMain" class="container">
			<strong>{{ scores.description }}</strong>
		</div>
	</div>
</template>

<script>
   	import store from '../store.js';

    	export default {
		name: 'allStar',
		components: {		
			},
		data () {
			var updateDailyScore = []
			//var loading = store.state.score.loading
			var loading = true;
			var render = true;
			var data = {}
			var teamInfo = []
			return {
				updateDailyScore,
				teamInfo, 
				data,
				render,
				loading
			}
		},
		computed: {
			loadingDOM(){
				//this.loading = false
				return this.loading
			},
			updateStoreScoreboard () {
				//this.teamInfo = store.state.team.teamArray
				//console.log("teamAray Length: " + this.teamInfo[0].startingIndex)
				return store.state.score.dailyScores
			},
			updateAllStarScore () {
				console.log("updateAllStarScore " + JSON.stringify(store.state.score.allStarScoren))
				return store.state.score.allStarScore
			},
			updateTeamInfo () {
				this.teamInfo = store.state.team.teamArray 
			},
			getDate() {
				/*
				this.storeDates.year = store.state.score.dateObject.year
				this.storeDates.month = store.state.score.dateObject.month
				this.storeDates.day = store.state.score.dateObject.day
				*/
				return this.storeDates
			}
		},
		methods: {
			getStoreMutations () {
				store.commit('updateScoreboardNew')
			},
			updateTeamInningRange (away, home, inning) {
				var awayTeamIndex = store.state.team.teamArray.findIndex(team => team.name === away)
				var homeTeamIndex = store.state.team.teamArray.findIndex(team => team.name === home)
				if (store.state.team.teamArray[awayTeamIndex].starting == true) {
					var endingIndex = inning - 1
					var startIndex = inning - 10
					store.state.team.teamArray[awayTeamIndex].starting = false
					var teamIndexObj = {
					"awayTeamIndex": awayTeamIndex,
					"homeTeamIndex": homeTeamIndex,
					"startIndex": startIndex,
					"endingIndex": endingIndex
					}
				} else {
					var teamIndexObj = {
						"awayTeamIndex": awayTeamIndex,
						"homeTeamIndex": homeTeamIndex
					}
				}
				store.commit('updateTeamIndex', teamIndexObj)
			},
			showLaterInning (away, home) {
				var awayTeamIndex2 = store.state.team.teamArray.findIndex(team => team.name === away)
				var homeTeamIndex2 = store.state.team.teamArray.findIndex(team => team.name === home)
				var teamIndex2Obj = {
					"awayTeamIndex": awayTeamIndex2,
					"homeTeamIndex": homeTeamIndex2
				}
				store.commit('showLateInning', teamIndex2Obj)
			},
			showEarlierInning (away, home) {
				var awayTeamIndex3 = store.state.team.teamArray.findIndex(team => team.name === away)
				var homeTeamIndex3 = store.state.team.teamArray.findIndex(team => team.name === home)
				var teamIndex3Obj = {
					"awayTeamIndex": awayTeamIndex3,
					"homeTeamIndex": homeTeamIndex3
				}
				store.commit('showEarlyInning', teamIndex3Obj)
			},
			getAwayStartIndex(away) {
				var awayTeamIndex2 = store.state.team.teamArray.findIndex(team => team.name === away)
				return store.state.team.teamArray[awayTeamIndex2].startingIndex
			},
			getAwayEndIndex(away) {
				var awayTeamEndIndex2 = store.state.team.teamArray.findIndex(team => team.name === away)
				return store.state.team.teamArray[awayTeamEndIndex2].endingIndex
			},
			getHomeEndIndex(home) {
				var homeTeamEndIndex2 = store.state.team.teamArray.findIndex(team => team.name === home)
				return store.state.team.teamArray[homeTeamEndIndex2].endingIndex
			},
			getHomeStartIndex(home) {
				var homeTeamIndex2 = store.state.team.teamArray.findIndex(team => team.name === home)
				return store.state.team.teamArray[homeTeamIndex2].startingIndex
			},
			showRightArrow(score, away) {
				//console.log("showRightArrow: " + score)
				var awayArrowIndex = store.state.team.teamArray.findIndex(team => team.name === away)
				var showRight = store.state.team.teamArray[awayArrowIndex].endingIndex < (score-1)
				//console.log("showRightArrow: " + showRight)
				return showRight
			},
			getPitcherPicURL(id) {
				var winULR = "http://content.mlb.com/images/headshots/current/60x60/" + id + ".png"
				return winULR
			},
			showLeftArrow(away) {
				var awayArrowIndex2 = store.state.team.teamArray.findIndex(team => team.name === away)
				var showLeft = !(store.state.team.teamArray[awayArrowIndex2].startingIndex == -1)
				//console.log("showLeftArrow: " + showLeft)
				//console.log("showLeftArrowStartingIndex: " + store.state.team.teamArray[awayArrowIndex2].startingIndex)
				return showLeft
			},
			save (date) {
				this.loading = true;
				//Updating store with the new date
				//store.commit('updateDate', this.storeDates.date) -- for use w/o date picker
				store.commit('updateDatePicker', this.storeDates.date)
			},
			winner(score) {
				if(score.linescore.r.home > score.linescore.r.away) {
					return "win"
				}
			},
			getHomerRuns(homeRunArray) {
				if(!homeRunArray.home_runs.player) {
					return homeRunArray
				} else {
					return homeRunArray.home_runs.player
					console.log(homeRunArray.home_runs.player.length + " number of home runs")
				}
			},
			getHRTitle(homeRunArray, team) {
				//console.log("length: " + hrArray.length)
				if(!homeRunArray.home_runs.player) {
					return false
				} else {
					var i;
					for (i = 0; i < homeRunArray.home_runs.player.length; i++) {
						if(homeRunArray.home_runs.player[i].team_code == team) {
							return true
						} 
					}
				}
			}
		},
		beforeMount () {
			this.getStoreMutations();
		},
		mounted () {
		},
		beforeUpdate () {
		},
		updated () {
		}
	}
</script>

<style>
	#scoreSummary {
		background-color: #D3D3D3;
		border: 2px solid #D3D3D3;
		border-radius: 3px;
		padding-bottom: 2px;
	}
	#scoreSpace {
		background-color: white;
		padding: 5px;
	}
	#winLossRecord {
		font-size: 75%;
		color: grey;
	}
	#teamName {
		font-size: 105%;
	}
	#boxscores tbody tr td {
		font-size: 100%;
		border-width: 0px;
		background-color: white;
	}
	#boxscores tbody tr td div {
		font-size: 95%;
		border-width: 0px;
		background-color: white;
	}
	#gameStatus {
		color: red;
	}
	#inning {
		color: grey;
	}
	tbody {
		font-family: Arial;
		font-size: 15px;
	}
	.win {
		font-weight: bold;
	}
	#playerPic {
		height: 30px;
		width: 30px;
		border-radius: 50%;
	}
	#summary {
		text-align: center;
	}
	#tableheader {
		background-color: black;
	}
	#tableHead {
		background-color: white;
	}
	#longDate {
		font-size: 35px;
		font-family:  "Trebuchet MS";
	}
	#dailyScoreMain {
		background-color: white;
	}
	#picker {
		background-color: white;
	}
	#playerBox {
		font-size: 13px;
	}
</style>
