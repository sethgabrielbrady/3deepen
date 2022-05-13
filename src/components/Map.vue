<template>
  <div id="3dmap" style="position: relative;">
    <div style="position: absolute; background: black; opacity: .8; padding-bottom: 1rem; p2">
      <p  style="transform:translateX(calc(50vw - 64px)); positioon: relative; color:white;">World Map</p><br>
      <div style="position: relative; color: white;">
        <p v-if="toggleDrag" style="font-size: 1.5rem; background-color: orange; width: 100px;">Drag</p>
        <p v-else style="font-size: 1.5rem; background-color: blue; width: 100px;">Orbit</p>
        <br>
        <button  class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 mr-2 rounded" @click="centerPerspective">Center</button>
        <button  class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="sidePerspective">Side</button><br>
        <button @click="gridToggle">Grid Toggle</button><br>
        <input class="text-black" v-model="gridInput" placeholder="Gridcount" style="width: 50px;"/>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="updateGrid">Update</button>
        <br>
        <label for="image-upload" class="">Change Map Image</label><br>
        <input type="file" accept="image/*" class="text-black" id="image-upload" @change="showPreview($event)" />
        <ul v-if="imageArray.length > 0">
          <li v-for="image in imageArray" :key="image" style="text-decoration: none; display: inline-block; width:40px; height: 40px; overflow:hidden;">
            <img :src="image" @click="updateWithSelectedImage(image)" class="preview-image"  width="auto" height="auto"/>
          </li>
      </ul><br>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="toggleMarkerModal = ! toggleMarkerModal">Add marker</button><br>
      <div v-if="toggleMarkerModal" style="background-color: white;">
        <input class="text-black" v-model="markerSize" placeholder="X" style="width: 2rem;"/>
        <input class="text-black" v-model="markerSize" placeholder="Y" style="width: 2rem;"/>
        <input class="text-black" v-model="markerSize" placeholder="Z" style="width: 2rem;"/><br>

        <input class="text-black" v-model="markerColor" placeholder="Marker Color" style="width: max-content;"/><br>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 mt-4 rounded" @click="addMarker()">Add marker</button><br>
      </div>
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
      toggleDrag: false,
      markerArray: [],
      toggleMarkerModal: false,
      label:null,
      imgx: null,
      imW:null,
      // imH: Number
      mapSceneData: {}
    }
  },
  computed: {
    gridCount () {
      return this.gridInput
    }
  },
  created() {
    // const localImages = localStorage.getItem("images")
    // this.imageArray = localImages
  },
  methods: {
    showPreview(event){
      if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        this.imageArray.push(src);
        this.imageInput = src
        localStorage.setItem("images", this.imageArray);
        console.log(localStorage.getItem("images"))
      }
    },
    getImageWidth(imgSrc){
      var img = new Image();
      img.src = imgSrc;
      img.onload = function(){
      }
      this.imW = img.naturalWidth
      this.imH = img.naturalHeight

      return [img.naturalWidth, img.naturalHeight]
    },
    gridToggle () {
      this.gridVisible = !this.gridVisible
      return this.gridVisible
    },
    updateGrid () {
      this.scene.remove(this.cube);
      this.scene.remove(this.gridHelper);
      this.gridSetup();
      this.scene.add(this.gridHelper);
      this.scene.add(this.cube);
    },
    updateWithSelectedImage(img) {
      this.imageInput = img
      let dims = this.getImageWidth(img)
      console.log("1", dims)
      this.updateMapImage(dims)
    },
    updateMapImage (dim) {
      this.scene.remove(this.model)
      this.textures()
      console.log("2",dim)
      this.addModel(dim);
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
    addModel(xy) {
      console.log("3", xy)
      let model = null
      if (xy) {
        console.log("4", xy)
        this.geometry = new THREE.BoxGeometry((xy[0]/10), (xy[1]/10), 1);
      }else {
        this.geometry = new THREE.BoxGeometry(100, 100, 1);
        this.mapSceneData.mapGeoX = 100;
        this.mapSceneData.mapGeoY = 100;
        this.mapSceneData.mapGeoZ = 1;

      }
      this.materials = [
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } ),
        new THREE.MeshPhongMaterial( {map: this.floorTexture} ),
        new THREE.MeshPhongMaterial( { color: 0xff0000 } )

      ];
        this.mapSceneData.mapMatsArray = 0xff0000

        model = new THREE.Mesh(this.geometry, this.materials);


        model.position.z = -5.05;

      this.model = model;
      this.scene.add(this.model)
    },
    addWireframeAirspace() {
      let containerGeo = new THREE.BoxGeometry(99.9, 99.9, 100);
      //places the floor plane slightly below the grid helper
      let wire = [
        new THREE.MeshPhongMaterial({color: 0x000000, wireframe: true, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0x000000, wireframe: true, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: true, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: true, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: true, opacity: .15, transparent: true} ),
        new THREE.MeshPhongMaterial({color: 0xff00ff, wireframe: true, opacity: .15, transparent: true} ),
      ]
      let wireGeo = new THREE.Mesh(containerGeo, wire);
      wireGeo.position.z = 45;
      this.scene.add(wireGeo)
    },
    addMarker () {
      // let markerPos = {};
      const randomColor = Math.floor(Math.random()*16777215)
      alert(randomColor)
      let gridUnit = (100 / this.gridInput)
      let cubegeo = new THREE.BoxGeometry(gridUnit, gridUnit, 5);
      let materials = [
        new THREE.MeshBasicMaterial( { color: randomColor } ),
        new THREE.MeshBasicMaterial( { color: randomColor } ),
        new THREE.MeshBasicMaterial( { color: randomColor } ),
        new THREE.MeshBasicMaterial( { color: randomColor } ),
        new THREE.MeshBasicMaterial( { color: randomColor } ),
        new THREE.MeshBasicMaterial( { color: randomColor } ),
      ]
      this.cube = new THREE.Mesh(cubegeo, materials);
      this.cube.position.z = -2;
      let panelSize = 1 * (gridUnit / 2 );
      this.cube.position.y = ( (-1 * (panelSize) ) * 2)
      this.cube.position.x = panelSize
      this.markerArray.push(this.cube);
      alert("new marker added");
      // markerPos = {
      //   x: this.cube.position.x,
      //   y: this.cube.position.y,
      //   z: this.cube.position.z
      // }

      this.markerArray.forEach(marker => {
        this.scene.add(marker);
      })
      // panelSize
    },
    // addSprite () {
    //   const loader = new THREE.TextureLoader();
    //   var treetexture = loader.load( this.imageInput );
    //   treetexture.magFilter = THREE.NearestFilter;
    //   var treematerial = new THREE.Material( { map: treetexture,color:0x000000, transparent:true} );
    //   var treesprite = new THREE.Sprite( treematerial );
    //   treesprite.scale.set( 10, 10, 1);
    //   treesprite.position.set(0, 0, .5);
    //   this.scene.add(treesprite);
    // },
    addRenderer () {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0xffffff);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    shiftPressed(e){
      if (e.shiftKey) {
        this.toggleDrag = !this.toggleDrag
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
      // this.addSprite()


      // this.addMarker ()
      this.addWireframeAirspace()
      this.addRenderer()

      this.dragControls = new DragControls( this.markerArray, this.camera, this.renderer.domElement );
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

      // check z position of markers
      this.markerArray.forEach(marker => {
        if (marker.position.z > -2 || marker.position.z < -2){
          marker.position.z = -2
        }
      })

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

