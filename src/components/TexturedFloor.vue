<template>
  <div id="container"></div>
</template>
<script>
import * as THREE from 'three'

export default {
  name: 'Breakout',
  data() {
    return {
      container: null,
      stats: null,
      camera: null,
      scene: null,
      renderer: null,
      frustumSize: 1000,

      floor: null,

      gridHelper: null,
      paddleWidth: null,
      test: null,
      sc: 0, //score
      target: null,
    }
  },
  methods: {
    init: function() {

    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.camera.position.z = 800;
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xf0f0f0 );

      //textures
      const loader = new THREE.TextureLoader();
      const testTexture = loader.load('https://mk0a2minutetabl7hq7i.kinstacdn.com/wp-content/uploads/2021/04/Sacred-Spring-battle-map-Cropped.jpg');

      // Grid
      this.gridHelper = new THREE.GridHelper(1000,12,0xff0000, 0x0000ff);
      this.gridHelper.rotation.x = -45.553;
      this.scene.add( this.gridHelper );

      // floor
      const geometry = new THREE.PlaneGeometry(1000, 1000)
      const material = new THREE.MeshBasicMaterial({
        map: testTexture, side: THREE.DoubleSide
      });
      this.floor = new THREE.Mesh(geometry, material);
      //places the floor plane slightly below the grid helper
      this.floor.position.z = -1;
      this.scene.add(this.floor)


      // renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      document.body.appendChild(this.renderer.domElement)

    },
    animate: function() {
      this.render();
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame( this.animate );
    },
    render: function() {
      // unset this for rotating camera
      // const timer = Date.now() * 0.0002;
      // this.camera.position.x = Math.cos(timer) * 800;
      // this.camera.position.z = Math.sin(timer) * 800;
      // this.camera.lookAt( this.scene.position );
      // this.renderer.render( this.scene, this.camera );
    },

  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>
