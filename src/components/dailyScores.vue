<template>
	<div>
		<div id="picker" class="container">
			<!-- Date Picker & Date Header --> 
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-4 col-xs-4" style="margin-left: -30px"
					data-toggle="tooltip"
					data-placement="left"
					title="Past Dates Only. Current/Future scores coming soon!"
					>
						<datePicker 
							lang="en" 
							:not-after="new Date(new Date().setDate(new Date().getDate()-1))" 
							@change="getInitDate"
							v-model="datePicker"
							></datePicker>
					</div>
					<div class="col-sm-1"></div>
					<div id="longDate" class="col-md-4">
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
		<div v-if="updateAllStarScore" id="dailyScoreMain" class="container">
			<!--<strong>{{ scores.description }}</strong>-->
			<AllStar :scoreData="allStarScoresComp"></AllStar>
		</div>
		<div v-else-if="noGameComp" id="dailyScoreMain" class="container">
			<strong>NO GAME TODAY!!</strong>
		</div>
		<pastScores @hook:updated="stopLoading" @hook:created="startLoading"></pastScores>
	</div>
</template>

<script>
	import store from '../store.js';
	import datePicker from 'vue2-datepicker'
	import LoadingSpinner from './loadingSpinner.vue'
	import AllStar from './AllStar.vue'
	import PastScores from './pastScore.vue'

	export default {
		name: 'dailyScores',
		components: {
			datePicker,
			LoadingSpinner,
			AllStar,
			PastScores  		
			},
		data () {
			var updateDailyScore = []
			var length = 0
			var tempYear = {
				year: "2017", 
				month: "07",
				day: "15"
			}
			var allStarScores = 'This is a Test'
			var noGame = 'No Games Today!!'
			var render = true;
			//var loading = store.state.score.loading
			var loading = true;
			var storeDates = {
				date: new Date(2017, 11, 15)
			}
			var data = {}
			var teamInfo = []
			return {
				updateDailyScore,
				length,
				tempYear, 
				shortcuts: [
					{
						onClick: () => {
							console.log('onClick ran')
							this.storeDates.date = date
						}
					}
				],
				storeDates,
				teamInfo, 
				data,
				loading,
				allStarScores
			}
		},
		watch: {
			updateDailyScore: function() {
				this.loading = false;
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
			noGameComp () {
				var noGameCheck = store.state.score.noGame ? true : false
				return noGameCheck
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
			stopLoading	() {
				this.loading = false;
			},
			startLoading () {
				this.loading = true;
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
			this.getInitDate();
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
			$(function(){
				$('[data-toggle="tooltip"]').tooltip();
			});
		}
	}
</script>

<style>

</style>