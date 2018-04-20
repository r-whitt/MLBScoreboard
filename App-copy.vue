<template>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="glyphicon glyphicon-time"></i>
          MLB Test
        </a>
        <ul class="nav navbar-nav">
          <!-- THIS IS DEPRECIATED IN VUE-ROUTER 2
          <li><a v-link="'/home'">Home</a></li>
          <li><a v-link="'/time-entries'">Time Entries</a></li>
          -->
          <li><router-link to="/home">Home</router-link></li>
          <li><router-link to="/time-entries">Schedule</router-link></li>
        </ul>
      </div>
    </nav>
    <!--
    <div v-for="data in getStoreTest">{{ data.message }}</div>
    <div><button class="btn btn-xs btn-danger" @click="updateMessage()">Update Message</button></div>
	-->
    <div class="container-fluid">
      <!-- REPLACED BY MAKING DAILYSCORES.VUE HOME IN MAIN.JS
        <dailyScores></dailyScores>-->
    </div>
    <router-view/>
  </div>
</template>

<script>
  import store from './store.js'
  import dailyScores from './components/dailyScores.vue'

export default {
  name: 'app',
  components: {
    dailyScores
  },
  data: {
    message: ""
  },
  computed: {
    getStoreTest() {
      return store.state
      return "test"
    }
  },
  methods: {
    updateMessage(message) {
      var message2 = " \n" + "3rd message"
      store.commit('updateState', message2)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
