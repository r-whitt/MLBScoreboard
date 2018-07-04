<template>
  <div class="jumbotron" id="imgWrapper">
      <div class="row">
        <img class="img-responsive center-block" id="pic" src="../assets/UnderConstruction.gif">
      </div>
      <div class="row">
          <h2 class="text-center" id="pic">Schedule Coming Soon!</h2>
      </div>
  </div>
</template>

<script>
import store from '../store.js'

export default {
  name: 'schedule'
}
</script>

<style>
#pic {
    display: block;
    margin-left: auto;
    margin-right: auto;
}
#imgWrapper {
    background-color:white;
}
</style>
