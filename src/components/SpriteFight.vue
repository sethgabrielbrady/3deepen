<template>
  <div id="3dmap" style="position: relative;">

  </div>
</template>

<script>
import * as THREE from '../../node_modules/three/build/three.module.js';
import oc from 'three-orbit-controls'
const OrbitControls = oc(THREE);

export default {
  components: {
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      floor: null,
      model: null,
      gridHelper: null,
      gridColor: 0xf0f0f0,
      backgroundColor: 0x000000,
      floorTexture: null,
      geometry: null,
      materials: null
    }
  },
  methods: {
    cameraSetup () {
      this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,1000)
      this.camera.position.z = 110
    },
    lightsSetup () {
      let ambientLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add( ambientLight );
    },
    textures () {
      const loader = new THREE.TextureLoader();
      this.floorTexture = loader.load('https://cdnb.artstation.com/p/assets/images/images/040/703/743/large/jay-grizguts-dndmapsmol.jpg');
    },
    gridSetup () {
      this.gridHelper = new THREE.GridHelper(200,100,0x0000ff, this.gridColor);
      this.gridHelper.rotation.x = 1.5708;
      this.gridHelper.position.z = -4.5;
      this.scene.add( this.gridHelper );
    },
    addModel() {
      this.geometry = new THREE.BoxGeometry(200, 100, 1);
      this.materials = [
        new THREE.MeshPhongMaterial( { color: 0xcccccc } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } ),
        // new THREE.MeshPhongMaterial( {map: this.floorTexture} ),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } )

      ];
      let model = new THREE.Mesh(this.geometry, this.materials);
      model.position.z = -5.05;
      this.model = model;
      this.scene.add(this.model)
    },
    addRenderer () {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0xffffff);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    init: function() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( this.backgroundColor )
      this.cameraSetup()
      this.lightsSetup()
      this.textures()
      this.gridSetup()
      this.addModel()
      // this.addSprite()
      this.addRenderer()
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
      const map = document.getElementById("3dmap")
      map.appendChild(this.renderer.domElement)
    },
    animate () {
      this.render()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame( this.animate )
    },
    render () {
    },
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>

<style>
</style>

