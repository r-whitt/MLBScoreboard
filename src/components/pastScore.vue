<template>
    <div>
        <div v-for="score in updateStoreScoreboard" id="dailyScoreMain" class="container">
			<div class="row">
				<div class="col">
					<!-- To Center the scores -->
					<div class="col-lg-3 col-md-2 col-xs-0"></div>
						<!-- ADD CAUSE FOR NO GAMES HERE --> 
					<div id="divTable" class="container col-lg-2 col-md-2 col-xs-3" style="margin-right:-70px">
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

					<div id="lineScores" class="container col-lg-2 col-md-2 col-xs-3" >
						<!-- Innings for < 11 Innigs --> 
						<table v-if="score.status.inning < 11" id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<!-- Inning # header -->
								<tr id="tableRow">
									<th></th>
									<th id="inning" v-for="(inning, index) in score.linescore.inning">{{ index + 1 }}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								<tr id="tableRow" height="55px">
									<td></td>
									<!-- Away runs scored per inning -->
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										<div v-if="inning.away.length == 0">X</div>
										<div v-else>{{ inning.away }}</div>
									</td>
									<td></td>
								</tr>
								<tr id="tableRow" height="55px">
									<td></td>
									<!--Home Away scored per inning -->
									<td id="inningScore" width="32px" v-for="(inning, index) in score.linescore.inning">
										<div v-if="inning.home.length == 0">X</div>
										<div v-else>{{ inning.home }}</div>
									</td>
									<!-- This is for only 9 inning games so the grey header underline meets the RHE table -->
									<td style="visibility:hidden">---</td>
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

					<div id="divTableRHE" class="container col-lg-1 col-md-2 col-xs-2">
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
								<tr v-if="!score.linescore">No Linescore in row</tr>
								<tr v-else id="tableRow" height="55px">
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)<parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.away }}</td>
									<td id="summary">{{ score.linescore.h.away }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
								<tr v-if="!score.linescore">No Linescore in row</tr>
								<tr v-else id="tableRow" height="55px">
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)>parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.home }}</td>
									<td id="summary">{{ score.linescore.h.home }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Players of the game after the box score --> 
					<div id="pitchers" class="container col-lg-2 col-md-2 col-xs-3">
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

					<div id="homeRuns" class="container col-sm-2">
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
    import dailyScores from './dailyScores'

    export default {
        name: 'pastScores',
        props: [
            'scores' //pass through data from dailyScores
        ], 
        data () {
			var updateDailyScore = []
			var render = true;
			//var loading = store.state.score.loading
			var loading = true;
			var data = {}
			var teamInfo = []
			return {
				updateDailyScore,
				teamInfo, 
				data,
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
			allStarScoresComp () {
				//Passes through the all star game data as a prop --this is so it will only show 1 time
				var allScore = store.state.score.allStarScore.game ? store.state.score.allStarScore : ''
				return allScore
			},
			updateAllStarScore () {
				//if there is All Star game data stored in Store, will show Allstar component
				var shouldShow = store.state.score.allStarScore.game ? true : false;
				return shouldShow
			},
			updateTeamInfo () {
				this.teamInfo = store.state.team.teamArray 
			},
			datePicker: {
				get: () => {
					return store.state.score.dateObject.full
				},
				set: date => {
					store.commit('updateDatePicker', date)
				}
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
			getInitDate () {
				this.storeDates.date = store.state.score.dateObject.full
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
				console.log("Save starting")
				this.loading = true;
				this.render = true;
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
			this.loading = true;
		},
		mounted () {
			$(function(){
				$('[data-toggle="tooltip"]').tooltip();
			});
		},
		beforeUpdate () {
		},
		updated () {
            this.loading = false;
            dailyScores.loading = false;
			$(function(){
				$('[data-toggle="tooltip"]').tooltip();
			});
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
	@media (min-width: 992px) and (max-width: 1199px) {
		#divTableRHE {
			margin-left: 104px;
		}
		#boxscores tbody tr td {
			padding-right: 9px;
		}
		#lineScores {
			margin-left: -10px;
		}
		#pitchers {
			margin-left:-5px
		}
		#homeRuns {
			margin-left:-45px
		}
	}
	@media only screen and (max-width: 991px) {
		#divTableRHE {
			margin-left: 77px;
		}
		#lineScores {
			margin-left: -20px;
		}
		#boxscores tbody tr td {
			padding-right: 9px;
		}
		#pitchers {
			margin-left: 0px;
		}
		#homeRuns {
			margin-left: -50px;
		}
	}
	@media only screen and (min-width: 1200px) {
		#divTableRHE {
			margin-left: 70px;
		}
		#lineScores {
			margin-left: -10px;
		}
		#pitchers {
			margin-left:-5px
		}
		#homeRuns {
			margin-left:-45px
		}
		#boxscores tbody tr td {
			padding-right: 9px;
		}
	}
</style>