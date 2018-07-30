<template>
  <div id="wrapper">
    <nav id="nav" class="navbar navbar-default">
      <div class="container">
        <router-link class="navbar-brand navText" to="/scores">
          <i class="glyphicon glyphicon-dashboard"></i>
          MLB Test
        </router-link>
        <ul class="nav navbar-nav">
          <li>
            <router-link class="navText" to="/scores">
              Scores
            </router-link>
          </li>
          <li>
            <router-link class="navText" to="/schedule">
              Schedule
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div id="mainPage">
      <div class="container-fluid">
      </div>
      <router-view/>
    </div>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  #nav {
    background-color: #221faf;
    height: 60px;
    border: 0;
    border-radius: 0;
    margin-bottom: 0;
  }
  i {
    color: white;
  }
  li:hover {
    height: 60px;
    opacity: 0.75;
  }
  .navText {
    color: white;
    font-family: Arial, "Times New Roman", serif;
  }
  #mainPage {
    background-color: #d6d6d6;
  }
</style>
