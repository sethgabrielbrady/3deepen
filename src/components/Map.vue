<template>
  <div id="3dmap" style="position: relative;">
    <div style="position: absolute;">
      <p  style="transform:translateX(calc(50vw - 64px)); positioon: relative; color:white;">World Map</p><br>
      <div style="position: relative; color: white;">
        <button @click="centerPerspective">Center</button><br>
        <button @click="sidePerspective">Side</button><br>
        <button @click="gridToggle">Grid</button><br>
        <input class="text-black" v-model="gridInput" placeholder="Gridcount"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="updateGrid">Update</button><br>
        <label for="image-upload" class="">Change Map Image</label><br>
        <input type="file" accept="image/*" class="text-black" id="image-upload" @change="showPreview($event)" />
        <ul v-if="imageArray.length > 0">
          <li v-for="image in imageArray" :key="image" style="text-decoration: none; display: inline-block;">
            <img :src="image" @click="updateWithSelectedImage(image)" class="preview-image"  width="40px" height="40px"/>
          </li>
      </ul>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from '../../node_modules/three/build/three.module.js';
import DragControls from 'three-dragcontrols';
import oc from 'three-orbit-controls'

const OrbitControls = oc(THREE);

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
      gridInput: 100,
      gridColor: 0xf0f0f0,
      backgroundColor: 0x000000,
      gridVisible: false,
      floorTexture: null,
      geometry: null,
      materials: null,
      vector: null,
      pos: null,
      cube: null,
      imageInput: "",
      imageArray: [],
      selectedImage: null,
      dragControls: null,
      orbitControl: null,
      toggleDrag: false
    }
  },
  computed: {
    gridCount () {
      return this.gridInput
    }
  },
  methods: {
    showPreview(event){
      if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        this.imageArray.push(src);
        this.imageInput = src
        this.updateMapImage();
      }
    },
    gridToggle () {
      this.gridVisible = !this.gridVisible
      return this.gridVisible
    },
    updateGrid () {
      this.scene.remove(this.cube);
      this.scene.remove(this.gridHelper);
      this.gridSetup();
      this.addMarker()
      this.scene.add(this.gridHelper);
      this.scene.add(this.cube);
    },
    updateWithSelectedImage(img) {
      this.imageInput = img
      this.updateMapImage();
    },
    updateMapImage () {
      this.scene.remove(this.model)
      this.textures()
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
      if (this.selectedImage) {
        this.floorTexture = loader.load(this.selectedImage);
      } else if (this.imageInput ) {
        this.floorTexture = loader.load(this.imageInput);
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
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { color: 0xff0000 } ),
        new THREE.MeshBasicMaterial( { map: this.floorTexture, opacity: 0.5 } ),
        new THREE.MeshBasicMaterial( { map: this.floorTexture, opacity: 0.5} )
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
    addMarker () {
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
    shiftPressed(e){
      if (e.shiftKey) {
        this.toggleDrag = !this.toggleDrag
        console.log("togg",this.toggleDrag)

      }
    },
    init: function() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( this.backgroundColor )
      this.cameraSetup()
      this.lightsSetup()
      this.textures()
      this.gridSetup()
      this.scene.add( this.gridHelper );
      this.addModel()
      this.addMarker ()
      // this.addWireframeAirspace()
      this.addRenderer()

      this.dragControls = new DragControls( [this.cube], this.camera, this.renderer.domElement );
      this.dragControls.addEventListener( 'dragstart', function () {});
      this.dragControls.addEventListener( 'dragend', function () {});
      this.dragControls.enabled = false

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
      document.addEventListener("keydown", this.shiftPressed);
      // document.addEventListener("keyup", this.shiftPressed, false);

      //toggle grid
      if (this.gridVisible){
        this.scene.add( this.gridHelper );
      } else {
        this.scene.remove(this.gridHelper);
      }

      if (this.toggleDrag) {
        this.dragControls.enabled = true;
        this.orbitControls.enabled = false;
      }else {
        this.orbitControls.enabled = true;
        this.dragControls.enabled = false;
      }
    },
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>

<style>
.preview-image:hover {
  transform: scale(1.2);
}
</style>