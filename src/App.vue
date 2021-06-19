<template>
  <div>
    <p @click="clearCanvas"> test </p>
    <router-link to="/">Home</router-link> |
    <router-link to="/three-test">Three Test</router-link> |
    <router-link to="/breakout">Breakout</router-link> |
    <router-view/>
  </div>
</template>

<script>
  export default {
    methods: {
      clearCanvas() {
        console.log("clear");
        alert("click");
      }
    }
  }
</script>
