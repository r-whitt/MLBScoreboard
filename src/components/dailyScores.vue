<template>
	<div>
		<div class="container-fluid">
			<!-- Date Picker & Date Header --> 
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-4">
						<datePicker placeholder="Select Date" v-model="storeDates.date" v-on:closed="save"></datePicker>
					</div>
					<div id="longDate" class="col-md-4" v-model="getDate">
						<label>{{ storeDates.date.toLocaleString("en-us", { month: "long" }) }}</label>
						<label> {{ storeDates.date.getDate() }}, </label>
						<label>{{ storeDates.date.getFullYear() }}</label>
					</div>
				</div>
			</div>
		</div>
		<!--Used to test w/o Date Picker
		<div class="row">
			<div class="col-sm-3" align="left">
				<label>Month</label>
				<input type="text" class="col-6" v-model="tempYear.month" placeholder="Month" />
			</div> 
			<div class="col-sm-3">
				<label>Day</label>
				<input type="text" class="col-6" v-model="tempYear.day" placeholder="Day" /></div>
			<div class="col-sm-3">
				<label>Year</label>
				<input type="text" class="col-6" v-model="tempYear.year" placeholder="Year" /></div>
		</div>
		<button class="bt btn-xs btn-danger" @click="save">Save</button>
		<button class="bt btn-xs btn-primary" @click="getStoreMutations">Get Scores!</button>
		-->
		<div v-for="score in updateStoreScoreboard">
			<div class="row">
				<div class="col">
					<!-- To Center the scores -->
					<div class="col-sm-3"></div>
						<!-- ADD CAUSE FOR NO GAMES HERE --> 
					<div id="divTable" class="container col-md-1" style="margin-right:-50px">
						<!-- Team Names, record, etc -->
						<table id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<th width="180px">
										<!-- Status of game - 'final', 'f/10', canceled, etc -->
										<div colspan="1" id="gameStatus" v-if="score.status.inning > 9">
											<span v-if="score.status.inning > 9">F/{{ score.status.inning }}</span>
										</div>
										<div v-else>
											<span id="gameStatus">{{ score.status.status }}</span>
										</div>
										<!-- ADD CONDITION FOR SHORTNED/CANCELD GAMES-->
									</th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="31px">
									<td margin-right="50px" width="120px">
									<!-- Away team Name & record -->
										<b id="teamName">{{ score.away_team_name }}</b>
										<br>
										<div id="winLossRecord">({{ score.away_win }} - {{ score.away_loss }})</div>
									</td>
								</tr>
								<tr id="tableRow" height="31px">
									<!-- Home Team Name & Record --> 
									<td width="120px">
										<!-- Home Team name & record -->
										<b id="teamName">{{ score.home_team_name }}</b>
										<div id="winLossRecord">({{ score.home_win }} - {{ score.home_loss }})</div>
									</td>
								</tr>
								<tr></tr>
							</tbody>
						</table>
					</div>

					<div id="divTable" class="container col-sm-2" style="margin-left:-10px">
						<!-- Innings for < 11 Innigs --> 
						<table v-if="score.status.inning < 11" id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<th></th>
									<th id="inning" v-for="(inning, index) in score.linescore.inning">{{ index + 1 }}</th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										{{ inning.away }}
									</td>
								</tr>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										<div v-if="inning.home.length == 0">X</div>
										<div v-else>{{ inning.home }}</div>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- Innings for Innings > 10 --> 
						<table v-else-if="score.status.inning > 10" v-bind="updateTeamInningRange(score.away_team_name, score.home_team_name, score.status.inning)"  id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<!-- Extra column for buttons -->
									<th>
										<a @click="showEarlierInning(score.away_team_name, score.home_team_name)"><i style="color:black" class="glyphicon glyphicon-chevron-left"></i></a>
									</th>
									<th style="margin-left:-20px">
										<i style="color:black" class="glyphicon glyphicon-chevron-right"></i>
									</th>
									<th id="inning" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getAwayStartIndex(score.away_team_name) && getAwayEndIndex(score.away_team_name)">{{ index + 1 }}</th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getAwayStartIndex(score.away_team_name) && getAwayEndIndex(score.away_team_name)">
										{{ inning.away }}
									</td>
								</tr>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getHomeStartIndex(score.home_team_name) && getHomeEndIndex(score.home_team_name)">
										<div v-if="inning.home.length == 0">X</div>
										<div v-else>{{ inning.home }}</div>
									</td>
								</tr>
							</tbody>
						</table>

						<!-- if the innings in status.inning don't match either of the above --> 
						<!-- Hopefully no game days will show this --> 
						<div v-else><span>Innings Didn't match</span></div>
					</div>

					<div id="divTable" class="container col-sm-1" style="margin-left:-30px">
						<!-- Summary --> 
						<table id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<th id="summary">R</th>
									<th id="summary">H</th>
									<th id="summary">E</th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)<parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.away }}</td>
									<td id="summary">{{ score.linescore.h.away }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
								<tr id="tableRow" height="55px">
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)>parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.home }}</td>
									<td id="summary">{{ score.linescore.h.home }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '../store.js'
	import datePicker1 from './datepicker.vue'
	import datePicker from 'vuejs-datepicker';

	export default {
		name: 'dailyScores',
		components: {
			datePicker,
			datePicker1
  		},
		data () {
			var updateDailyScore = []
			var length = 0
			var tempYear = {
				year: "2017", 
				month: "07",
				day: "15"
			}
			var storeDates = {
				date: new Date(2017, 6, 15)
			}
			var storeDates1 = {
				year: "", 
				month: "",
				day: ""
			}
			var teamInfo = []
			return {
				updateDailyScore,
				length,
				tempYear, 
				storeDates,
				teamInfo
			}
		},
		computed: {
			updateStoreScoreboard () {
				//this.teamInfo = store.state.team.teamArray
				//console.log("teamAray Length: " + this.teamInfo[0].startingIndex)
				return store.state.score.dailyScores
			},
			updateTeamInfo () {
				this.teamInfo = store.state.team.teamArray 
			},
			getterTest() {
				return store.getters.messageFilter
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
				var endingIndex = inning - 1
				var startIndex = inning - 10
				var teamIndexObj = {
					"awayTeamIndex": awayTeamIndex,
					"homeTeamIndex": homeTeamIndex,
					"startIndex": startIndex,
					"endingIndex": endingIndex
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
				console.log("click Registered")
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
			save (date) {
				console.log("save started ")
				//Updating store with the new date
				//store.commit('updateDate', this.storeDates.date) -- for use w/o date picker
				store.commit('updateDatePicker', this.storeDates.date)
				console.log("Sending to Store: " + this.storeDates.date)
				console.log("store: " + store.state.score.dateObject.year)
			},
			winner(score) {
				if(score.linescore.r.home > score.linescore.r.away) {
					return "win"
				}
			},
			updateScoreboard () {
				var year = "2017"
				var month = "07"
				var day = "15"
				var url = ("http://gd2.mlb.com/components/game/mlb/year_" + year + "/month_" + month + "/day_" + day + "/master_scoreboard.json")
				this.$http.get(url, {

					before(request) {
						if (this.previousRequest) {
							this.previousRequest.abort();
							console.log("Aborted previous request")
						}

						this.previousRequest = request;
					}
				}).then(response => {
					//success
					console.log("url: " + url + "\n" + "response is: " + JSON.stringify(response.body))
					this.updateDailyScore =response.body.data.games.game
					length = updateDailyScore.length()
					console.log("updateDailyScore length: " + updateDailyScore.length())
				}, response => {
					//error
					console.log("vue resource had an error: " + url + "\n" + "response is: " + response)
				})
			},
			scoreCheck(inning) {
				//console.log("scoreCheck: " + inning.length)
				if(inning){
					return inning
				} else {
					return "X"
				}
			},

			scoreCheck2(inning) {

			}
		},
		beforeMount () {
			this.getStoreMutations();
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
</style>