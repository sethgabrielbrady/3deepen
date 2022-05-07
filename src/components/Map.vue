<template>
  <div id="3dmap" style="position: relative;">
    <!-- <Stars /> -->
    <div style="position: absolute;">
      <p  style="transform:translateX(calc(50vw - 64px)); positioon: relative; color:white;">World Map</p><br>
      <div style="position: relative; color: white;">
        <button @click="centerPerspective">Center</button><br>
        <button @click="sidePerspective">Side</button><br>
        <button @click="gridToggle">Grid</button><br>
        <input class="text-black" v-model="gridInput" placeholder="Gridcount"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="updateGrid">Update</button><br>
        <input class="text-black" v-model="imageInput" placeholder="Image Url"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="updateMapImage">Update</button><br>

      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from '../../node_modules/three/build/three.module.js';
import DragControls from 'three-dragcontrols';
// import oc from 'three-orbit-controls'

export default {
  name: 'Map',
  components: {
  },
  data() {
    return {
      container: null,
      stats: null,
      camera: null,
      controls: null,
      scene: null,
      renderer: null,
      floor: null,
      model: null,
      gridHelper: null,
      OgGrid: 100,
      gridInput: 100,
      gridColor: 0xf0f0f0,
      backgroundColor: 0x000000,
      gridVisible: false,
      floorTexture: null,
      geometry: null,
      materials: null,
      mouse: null,
      vector: null,
      pos: null,
      cube: null,
      shiftPressed: false,
      imageInput: ""
    }
  },
  computed: {
    gridCount () {
      return this.gridInput
    },
    getImage () {
      return this.imageInput
    }
  },
  methods: {
    gridToggle () {
      this.gridVisible = !this.gridVisible
      return this.gridVisible
    },
    updateGrid () {
      this.scene.remove(this.cube);
      this.scene.remove(this.gridHelper);
      this.gridSetup();
      this.addCube()
      this.scene.add(this.gridHelper);
      this.scene.add(this.cube);
    },
    updateMapImage () {
      alert(this.getImage)
      this.scene.remove(this.model)
      this.textures()
      alert("modelRemoved")
      this.addModel();
    },
    centerPerspective () {
      this.camera.position.x = 0;
      this.camera.position.z = 110;
      this.camera.position.y = 5.5585370478817334e-14;
      this.camera.lookAt( this.scene.position );
    },
    sidePerspective () {
      this.camera.position.x = 1.661171824684954e-7;
      this.camera.position.z = 0.0001100203758069845;
      this.camera.position.y = -110;
      this.camera.lookAt( this.scene.position );
    },
    cameraSetup () {
      this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000)
      // must be called after any manual changes to the camera's transform
      this.camera.position.z = 110
    },
    lightsSetup () {
      let ambientLight = new THREE.AmbientLight( 0xffffff );
      this.scene.add( ambientLight );
      // let light = new THREE.PointLight( 0xf0f0f0 );
      // light.position.set( 1000, 1000, 1000 );
      // this.scene.add(light);
    },
    textures () {
      const loader = new THREE.TextureLoader();
      if (this.getImage ) {
        alert("get image", this.getImage)
        this.floorTexture = loader.load(this.getImage);
      } else {
        this.floorTexture = loader.load('https://cdnb.artstation.com/p/assets/images/images/040/703/743/large/jay-grizguts-dndmapsmol.jpg');
      }

    },
    gridSetup () {
      this.gridHelper = new THREE.GridHelper(100,this.gridCount,0xff0000, this.gridColor);
      this.gridHelper.rotation.x = 1.5708;
      this.gridHelper.position.z = -4.5;
    },
    addModel () {
      let model = null;
      this.geometry = new THREE.BoxGeometry(100, 100, 1);
      this.materials = [
        new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
        new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
        new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
        new THREE.MeshLambertMaterial( { color: 0xff0000 } ),
        new THREE.MeshLambertMaterial( { map: this.floorTexture } ),
        new THREE.MeshLambertMaterial( { map: this.floorTexture} )
      ];
        model = new THREE.Mesh(this.geometry, this.materials);
        console.log("width", model.geometry.parameters.height)
        //places the floor plane slightly below the grid helper
        model.position.z = -5.05;

      this.model = model;
      this.scene.add(this.model)
    },
    addWireframeAirspace() {
      let containerGeo = new THREE.BoxGeometry(99.9, 99.9, 100);
      //places the floor plane slightly below the grid helper
      let wire = [
        new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0x000000, wireframe: false, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: false, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: false, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: false, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: false, opacity: .15, transparent: true} ),
      ]
      let wireGeo = new THREE.Mesh(containerGeo, wire);
      wireGeo.position.z = 45;
      this.scene.add(wireGeo)
    },
    addCube () {
      // strting point for adding tokens
      let gridUnit = (100 / this.gridInput)
      let cubegeo = new THREE.BoxGeometry(gridUnit, gridUnit, 5);
      let materials = [
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
      ]
      this.cube = new THREE.Mesh(cubegeo, materials);
      //places the floor plane slightly below the grid helper
      this.cube.position.z = -2;
      let panelSize = 1 * (gridUnit / 2 );
      // let halfGrid = ( (100 / this.gridInput) / 2);
      this.cube.position.y = ( (-1 * (panelSize) ) * 2)
      this.cube.position.x = panelSize
      console.log( "x=", this.cube.position.x, ", y=",this.cube.position.y)
      console.log("color", this.cube)
      this.scene.add(this.cube);
      // panelSize
    },
    addRenderer () {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    logValues() {
      console.log(this.camera.position.x, this.camera.position.z, this.camera.position.y)
    },
    rotateModel() {
      // const timer = Date.now() * 0.0002;
      // this.camera.position.x = Math.cos(timer) * 800;
      // this.camera.position.y = Math.sin(timer) * 800;
      this.camera.rotation.x += 0.005
      this.camera.rotation.y += 0.005
      this.camera.lookAt( this.scene.position );
    },
    addDragControls () {
      const dcontrols = new DragControls( this.cube, this.camera, this.renderer );
      dcontrols.addEventListener( 'dragstart', function ( event ) {
        event.object.material.emissive.set( 0xaaaaaa );
      } );
      dcontrols.addEventListener( 'dragend', function ( event ) {
        event.object.material.emissive.set( 0x000000 );
      } );
    },
    // showChar(event){
    //   const e = event
    //   const OrbitControls = oc(THREE);
    //   let controls = new DragControls( [this.cube], this.camera, this.renderer.domElement );

    //   if (e.shiftKey) {
    //     this.shiftPressed = true;

    //   }else {
    //     this.shiftPressed = false;
    //   }

    //   if (this.shiftPressed) {
    //     //orbit controls
    //     controls = new OrbitControls(this.camera, this.renderer.domElement)
    //     controls.update()
    //   } else {
    //     controls.addEventListener( 'dragstart', function (event) {
    //     event.object.material.color( 0xaaaaaa );
    //       } );
    //     controls.addEventListener( 'dragend', function (event) {
    //     event.object.material.color( 0x000000 );
    //       } );
    //   }
    // },
    init: function() {
      // create a new scene
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( this.backgroundColor )
      // add the camera
      this.cameraSetup()
      // add the lights
      this.lightsSetup()
      // ready the textures
      this.textures()
      // add the grid
      this.gridSetup()
      this.scene.add( this.gridHelper );
      // add geometry and materials
      this.addModel()
      // this.scene.add(this.floor)
      // this.addWireframeAirspace()
      // renderer

      this.addRenderer()
      //orbit controls
      // const OrbitControls = oc(THREE);
      // const controls = new OrbitControls(this.camera, this.renderer.domElement)
      // controls.update()
      this.addCube();

      // const dcontrols = new DragControls( [this.cube], this.camera, this.renderer.domElement );
      // const map = document.getElementById("3dmap")
      // map.appendChild(this.renderer.domElement)
      // dcontrols.addEventListener( 'dragstart', function (event) {
      //   event.object.material.color( 0xaaaaaa );
      // } );
      // dcontrols.addEventListener( 'dragend', function (event) {
      //   event.object.material.color( 0x000000 );
      // } );
      // add to dom
      const map = document.getElementById("3dmap")
      map.appendChild(this.renderer.domElement)
    },
    animate () {
      // this.showChar(keydown);
      this.render()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame( this.animate )
    },
    render () {
      // document.addEventListener("keydown", this.showChar, false);
      // document.addEventListener("keyup", this.showChar, false);


      // this.rotateModel()
      //toggle grid
      if (this.gridVisible){
        this.scene.add( this.gridHelper );
      } else {
        this.scene.remove(this.gridHelper);
      }
      // this.logValues()
    },
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>
