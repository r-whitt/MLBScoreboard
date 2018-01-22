
<template>
	<div>
		<!-- Store Getter Test
		<div v-for="filteredMessage in getterTest">{{ filteredMessage.message }}</div>
		-->
		<div class="container-fluid">
			<!--To see current Date
			<div class="row">
			<div v-model="getDate"><label>Current Date:</label>   {{ storeDates.month }} / {{ storeDates.day }} / {{ storeDates.year }}</div>
			</div>
			--> 
			<div class="container-fluid">
				<datePicker class="row"></datePicker>
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
			<!--<div>{{ score.game.home_team_name}}</div>-->
			<!--<div>{{ score.home_team_name }}</div> -->
					<!-- To Center the scores -->
					<div class="col-sm-3"></div>
					<div id="divTable" class="container col-sm-4" >
						<table id="boxscores" class="table table-borderless">
							<thead id="tableHead">
								<tr id="tableRow">
									<th width="140px">
										<div id="gameStatus" v-if="score.status.inning > 9">
											<span v-if="score.status.inning > 9">F/{{ score.status.inning }}</span>
										</div>
										<div v-else>
											<span id="gameStatus">{{ score.status.status }}</span>
										</div>
										<!-- ADD CONDITION FOR SHORTNED/CANCELD GAMES-->
									</th>
									<th id="inning" v-for="(inning, index) in score.linescore.inning" colspan="9">{{ index + 1 }}</th>
									<th></th>
									<th id="summary">R</th>
									<th id="summary">H</th>
									<th id="summary">E</th>
								</tr>
							</thead>
							<tbody>
								<!-- Away Team line -->
								<!-- for Inning cound, can use the td for tr and v-fro a paginated table? -->
								<tr id="tableRow" height="31px">
									<td width="140px">
										<b id="teamName">{{ score.away_team_name }}</b>
										<br>
										<div id="winLossRecord">({{ score.away_win }} - {{ score.away_loss }})</div>
									</td>
									<td id="inningScore" width="32px" v-for="inning in score.linescore.inning" colspan="9">
										{{ inning.away }}
									</td>
									<td></td>
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)<parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.away }}</td>
									<td id="summary">{{ score.linescore.h.away }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
								<tr id="tableRow" height="31px">
									<td width="140px">
										<b id="teamName">{{ score.home_team_name }}</b>
										<div id="winLossRecord">({{ score.home_win }} - {{ score.home_loss }})</div>
									</td>
									<td id="inningScore" width="32px" v-for="inning in score.linescore.inning" colspan="9">
										<div v-for="inScore in scoreCheck(inning.home)">
											{{ inScore }} 
										</div>
									</td>
									<td></td>
									<td id="summary" v-bind:class="(parseInt(score.linescore.r.home)>parseInt(score.linescore.r.away)) ? 'win':''">{{ score.linescore.r.home }}</td>
									<td id="summary">{{ score.linescore.h.home }}</td>
									<td id="summary">{{ score.linescore.e.away }}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<!--
					<div id="scoreSummary" class="d-block col-sm-2 center">
						{{ score.away_team_name }}
						<br>
						{{score.home_team_name}}
					</div>
					-->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import store from '../store.js'
	import datePicker from './datepicker.vue'

	export default {
		name: 'dailyScores',
		components: {
    		datePicker
  		},
		data () {
			var updateDailyScore = []
			var length = 0
			var tempYear = {
				year: "", 
				month: "",
				day: ""
			}
			var storeDates = {
				year: "", 
				month: "",
				day: ""
			}
			return {
				updateDailyScore,
				length,
				tempYear, 
				storeDates
			}
		},
		computed: {
			updateStoreScoreboard () {
				return store.state.score.dailyScores
			},
			getterTest() {
				return store.getters.messageFilter
			},
			getDate() {
				this.storeDates.year = store.state.score.dateObject.year
				this.storeDates.month = store.state.score.dateObject.month
				this.storeDates.day = store.state.score.dateObject.day
				return this.storeDates
			}
		},
		methods: {
			/*
			getScores() {
				store.commit('updateScores', "2017", "07", "15")
			}
			*/
			getStoreMutations () {
				store.commit('updateScoreboardNew')
			},
			save (date) {
				console.log("save started")
				//Updating store with the new date
				store.commit('updateDate', this.tempYear)
				console.log("Year: " + this.tempYear.year)
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

					//responseType: 'json'

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
				if(inning){
					return inning
				} else {
					return "X"
				}
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
</style>