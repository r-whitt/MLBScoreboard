<template>
    <div class="jumbotron" id="imgWrapper">
      <p>Testing</p>
      <!-- to make wheel appear/disappear change the id -->
      <div class="img-responsive center-block"  v-bind:class="{'loader': isLoading}"></div>
      <div align="center" v-show="isLoading">
        <p>Loading....</p>
      </div>
      <br>
      <br>
      <br>
      <br> 
      <img src="../assets/wrench2.jpg" id="loader2" class="img-responsive center-block"/>
  </div>
</template>

<script>
import store from '../store.js'

export default {
  name: 'spinnerTest',
  data() {
      var isLoading = true;
      return {
          isLoading
      }
  }, 
  methods: {
      loading() {
          return true
      }
  }
}
</script>

<style>
#imgWrapper {
    background-color:white;
}
.loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #221faf; /*Blue*/
    border-radius: 50%; /*makes the image a wheel*/
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite; /*can name 1st pos. ('spin') differently, just ref. @keyframe. This determines speed, duration, action, etc*/
    display: block;
    margin-left: auto;
    margin-right: auto;
}
#loader2 {
    border-radius: 20%;
    animation: spin 2s linear infinite;
    display: block;
    margin-left: auto;
    margin-right: auto;

}
#loadText {
    margin: auto;
    display: inline-block;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
