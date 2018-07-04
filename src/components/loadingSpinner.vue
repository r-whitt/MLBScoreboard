<template>
    <div id="imgWrapper">
      <transition name="modal" v-if="isLoading">
          <div class="modal-mask">
              <div class="modal-wrapper">
                  <div class="modal-container">
                      <!-- <div class="modal-header"><slot name="header">Header Text</slot></div>-->
                      <!-- <div class="modal-body"><slot name="body">Body Text</slot></div> -->
                      <!-- <div class="modal-footer"><slot name="footer">Footer Text</slot></div> --> 
                      <!-- <button class="modal-default-button" @click="$emit('close')">OK</button> --> 
                    <div class="img-responsive center-block"  v-bind:class="{'loader': isLoading}"></div>
                    <div align="center" v-show="isLoading">
                        <p>Loading....</p>
                    </div>
                  </div>
              </div>
          </div>
      </transition>
  </div>
</template>

<script>
import store from '../store.js'

export default {
  name: 'loadingSpinner',
  data() {
      var isLoading = store.state.score.loading;
      return {
          isLoading
      }
  }, 
  methods: {
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
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}
.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}
.modal-container {
    width: 300px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
}
.modal-body {
    margin: 20px 0;
}
.modal-header {
    margin-top: 0;
    color: #42b983;
}
</style>
