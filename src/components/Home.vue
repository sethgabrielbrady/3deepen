<template>
  <div>
    <p>Home</p>
  </div>

</template>

<script>
import * as THREE from 'three'


export default {
  methods: {
      init: function() {
        this.scene = new THREE.Scene()
      }
  }
}
</script>