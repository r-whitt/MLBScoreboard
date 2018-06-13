<template>
	<div>
		<div id="picker" class="container">
			<!-- Date Picker & Date Header --> 
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-4" style="margin-left: -30px">
						<datePicker placeholder="Select Date" v-model="storeDates.date" v-on:closed="save"></datePicker>
					</div>
					<div class="col-sm-1"></div>
					<div id="longDate" class="col-md-4" v-model="getDate">
						<label>{{ storeDates.date.toLocaleString("en-us", { month: "long" }) }}</label>
						<label> {{ storeDates.date.getDate() }}, </label>
						<label>{{ storeDates.date.getFullYear() }}</label>
					</div>
				</div>
			</div>
		</div>
		<LoadingSpinner v-show="loadingDOM"></LoadingSpinner>
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
		<!--
		<i v-if="true" class="fa fa-spinner fa-spin"></i>
		-->
		<div v-for="score in updateStoreScoreboard" id="dailyScoreMain" class="container">
			<div class="row">
				<div class="col">
					<!-- To Center the scores -->
					<div class="col-sm-3"></div>
						<!-- ADD CAUSE FOR NO GAMES HERE --> 
					<div id="divTable" class="container col-md-2" style="margin-right:-75px">
						<!-- Team Names, record, etc -->
						<table id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<th width="180px">
										<!-- Status of game - 'final', 'f/10', canceled, etc -->
										<div colspan="1" id="gameStatus" v-if="score.status.inning > 9">
											<span v-if="score.status.inning > 9">F/{{ score.status.inning }}</span>
										</div>
										<div v-else-if="score.status.status == 'Completed Early'">
											<span v-if="score.status.status == 'Completed Early'" id="gameStatus">Weather</span>
											<span v-else id="gameStatus">{{ score.status.status }}</span>
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
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										<div v-if="inning.away.length == 0">X</div>
										<div v-else>{{ inning.away }}</div>
									</td>
									<td></td>
								</tr>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										<div v-if="inning.home.length == 0">X</div>
										<div v-else>{{ inning.home }}</div>
									</td>
									<td></td>
								</tr>
								<br>
							</tbody>
						</table>

						<!-- Innings for Innings > 10 --> 
						<table v-else-if="score.status.inning > 10" v-bind="updateTeamInningRange(score.away_team_name, score.home_team_name, score.status.inning)"  id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
								<!-- Extra column for buttons -->
								<th v-if="showLeftArrow(score.away_team_name)">
									<a style="margin-left:-40px" @click="showEarlierInning(score.away_team_name, score.home_team_name)"><i style="color:black" class="glyphicon glyphicon-chevron-left small"></i></a>
								</th>
								<th v-else></th>
								<th v-if="showRightArrow(score.status.inning, score.away_team_name)">
									<a style="margin-left:-40px" @click="showLaterInning(score.away_team_name, score.home_team_name)"><i style="color:black" class="glyphicon glyphicon-chevron-right small"></i></a>
								</th>
								<th v-else></th>
								<!--<th v-else></th> -->
								<th id="inning" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getAwayStartIndex(score.away_team_name) && index <= getAwayEndIndex(score.away_team_name)"><div style="margin-left:-30px">{{ index + 1 }}</div></th>
							</tr>								
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getAwayStartIndex(score.away_team_name) && index <= getAwayEndIndex(score.away_team_name)">
										{{ inning.away }}
									</td>
									<td></td>
								</tr>
								<tr id="tableRow" height="55px">
									<td></td>
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning" v-bind="updateTeamInfo" v-if="index > getHomeStartIndex(score.home_team_name) && index <= getHomeEndIndex(score.home_team_name)">
										<div v-if="inning.home.length == 0">X</div>
										<div v-else>{{ inning.home }}</div>
									</td>
									<td></td>
								</tr>
								<br>
							</tbody>
						</table>

						<!-- if the innings in status.inning don't match either of the above --> 
						<!-- Hopefully no game days will show this --> 
						<div v-else><span>Innings Didn't match</span></div>
					</div>

					<div id="divTable" class="container col-sm-1" style="margin-left: 50px">
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

					<!-- Players of the game after the box score --> 
					<div id="divTable" class="container col-sm-2" style="margin-left:-5px">
						<table id="boxscores" class="table table-borderless">
							<tbody id="playerBox">
								<tr id="tableRow" height="55px">
									<td style="margin-bottom: -10px">
										<img :src=getPitcherPicURL(score.winning_pitcher.id) id="playerPic" class="img-circle">
									</td>
									<td>
										<small><strong>W: {{ score.winning_pitcher.last }}</strong></small>
										<br><small>({{ score.winning_pitcher.wins }}-{{ score.winning_pitcher.losses }} {{ score.winning_pitcher.era }} ERA)</small>
									</td>
								</tr>
								<tr id="tableRow" height="55px">
									<td style="width:30px">
										<img :src=getPitcherPicURL(score.losing_pitcher.id) id="playerPic" class="img-circle">
									</td>
									<td>
										<small><strong>L: {{ score.losing_pitcher.last }}</strong></small>
										<br><small>({{ score.losing_pitcher.wins }}-{{ score.losing_pitcher.losses }} {{ score.losing_pitcher.era }} ERA)</small>
									</td>
								</tr>
								<tr v-if="score.save_pitcher.id >= 1" id="tableRow" height="55px">
									<td style="width:30px">
										<img :src=getPitcherPicURL(score.save_pitcher.id) id="playerPic" class="img-circle">
									</td>
									<td>
										<small><strong>SV: {{ score.save_pitcher.last}}</strong></small>
										<br><small id="winLossRecord">({{ score.save_pitcher.saves }})</small>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div id="divTable" class="container col-sm-2" style="margin-left:-45px">
						<table id="boxscores" class="table table-borderless">
							<tbody>
								<tr id="tableRow" height="55px">
									<td>
										<div v-if="getHRTitle(score, score.away_code)">
											<small><strong>AWAY HR:</strong></small>
										</div>
										<div v-for="player in getHomerRuns(score)">
											<td v-if="player.team_code == score.away_code">
												<small>{{ player.first[0] }} {{ player.last}} ({{ player.std_hr }})</small>
											</td>
										</div>
										<div v-if="getHRTitle(score, score.home_code)">
											<strong><small>Home HR:</small></strong>
										</div>
										<div v-for="player in getHomerRuns(score)">
											<td v-if="player.team_code == score.home_code">
												<small>{{ player.first[0] }} {{ player.last}} ({{ player.std_hr }})</small>
											</td>
										</div>
									</td>
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
	import store from '../store.js';
	import datePicker1 from './datepicker.vue';
	import datePicker from 'vuejs-datepicker';
	import LoadingSpinner from './loadingSpinner.vue'
	//import 'font-awesome/css/font-awesome.css'; 
	export default {
		name: 'dailyScores',
		components: {
			datePicker,
			datePicker1,
			LoadingSpinner  		
			},
		data () {
			var updateDailyScore = []
			var length = 0
			var tempYear = {
				year: "2017", 
				month: "07",
				day: "15"
			}
			//var loading = store.state.score.loading
			var loading = true;
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
				teamInfo, 
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
				}
				return homeRunArray.home_runs.player
				console.log(homeRunArray.home_runs.player.length + " number of home runs")
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
			this.loading = true;
		},
		mounted () {
		},
		beforeUpdate () {
		},
		updated () {
			this.loading = false;
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