<template>
  <div id="container"></div>
</template>

<script>
import * as THREE from 'three'
// import * as OrbitControls from 'three-orbit-controls'

export default {
  name: 'TexturedFloor',
  data() {
    return {
      container: null,
      stats: null,
      camera: null,
      controls: null,
      scene: null,
      renderer: null,
      floor: null,
      gridHelper: null
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
      const floorTexture = loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg');

      // Grid
      this.gridHelper = new THREE.GridHelper(1000,12,0xff0000, 0x0000ff);
      this.gridHelper.rotation.x = -45.553;
      this.scene.add( this.gridHelper );

      // floor
      const geometry = new THREE.PlaneGeometry(1000, 1000, 1000)
      const material = new THREE.MeshBasicMaterial({
        map: floorTexture, side: THREE.DoubleSide
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

      // controls
      // this.controls = new OrbitControls( this.camera, this.renderer.domElement );
      //controls.update() must be called after any manual changes to the camera's transform
      // this.camera.position.z = 800;

      // this.controls.update();

      document.body.appendChild(this.renderer.domElement)
    },
    animate: function() {
      // this.controls.update();
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
