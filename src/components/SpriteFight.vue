<template>
  <div id="3dmap" style="position: absolute; overflow:hidden;"></div>
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
      publicPath: process.env.BASE_URL,
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
      materials: null,
      tilesHorizontal: null,
      tilesVertical: null,
      numberOfTiles: null,
      tileDisplayDuration: null,
      currentDisplayTime: null,
      currentTile: null,
      texture: null,
      spriteTexture: null,
      sprite1: null,
      targetPosition: null,
      spriteSmoothness: .3,
      moveRate: 5,
      lastKeyPressed: null,
      currentKeyPressed: null,
      rightPressed: false,
      leftPressed: false,
      clock: null
    }
  },
  methods: {
    cameraSetup () {
      this.camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000)
      this.camera.position.z = 130
      this.camera.position.y = -70
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
      this.gridHelper = new THREE.GridHelper(250,100,0x0000ff, this.gridColor);
      this.gridHelper.rotation.x = 1.5708;
      this.gridHelper.position.z = -4.5;
      this.scene.add( this.gridHelper );
    },
    addBackground() {
      this.geometry = new THREE.BoxGeometry(400, 150, 1);
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
    addSprite () {
      this.currentTile = 0
      // const tileH = 13
      // const tileV = 1
      const loader = new THREE.TextureLoader();
      this.spriteTexture = loader.load("/fulgore2.png");
      this.spriteTexture.magFilter = THREE.NearestFilter;
      // this.spriteTexture.repeat.set(1/tileH, 1/tileV)

      // const offsetX = (this.currentTile % tileH) / tileH
      // const offsetY = (tileV - Math.floor(this.currentTile/tileH)-1)/tileV

      // this.spriteTexture.offset.x = offsetX
      // this.spriteTexture.offset.y = offsetY

      var spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteTexture, color:0xffffff, transparent:true} );
      this.sprite1 = new THREE.Sprite( spriteMaterial );
      this.sprite1.scale.set(25, 50, 2);
      this.sprite1.position.set(0, 0, 15);
      this.scene.add( this.sprite1);
    },
    animateSprite(texture, h, v){
      let tileH = h
      let tileV = v
      texture.repeat.set(1/tileH, 1/tileV)
      const offsetX = (this.currentTile % tileH) / tileH
      const offsetY = (tileV - Math.floor(this.currentTile/tileH)-1)/tileV

      texture.offset.x = offsetX
      texture.offset.y = offsetY
    },
    moveSpriteRight () {
      this.targetPosition = this.sprite1.position.clone();
      this.targetPosition.x += this.moveRate
      this.sprite1.position.lerp(this.targetPosition, this.spriteSmoothness);

    },
    moveSpriteLeft () {
      this.targetPosition = this.sprite1.position.clone();
      this.targetPosition.x -= this.moveRate

      this.sprite1.position.lerp(this.targetPosition, this.spriteSmoothness);
    },
    smother () {
      // const object = this.sprite1
      // const smoothness = 0.1 // 0 to 1 only
      // this.targetPosition = object.position.clone();
      // this.targetPosition.z -= 0.5;
      // this.sprite1.position.lerp(this.targetPosition, 0.1);
    },
    keyUpped(){
    const lastKey = this.lastKeyPressed
    if (lastKey == 68) {
        this.currentTile = 0
      }
      if (lastKey == 65) {
        this.currentTile = 0
      }
      this.rightPressed = false
      this.leftPressed = false
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
      this.clock = new THREE.Clock();

      this.cameraSetup()
      this.lightsSetup()
      this.textures()
      // this.gridSetup()
      this.addBackground()
      this.addSprite()
      this.addRenderer()
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
      const map = document.getElementById("3dmap")
      map.appendChild(this.renderer.domElement)
    },
    animate () {
      this.render()
      this.renderer.render(this.scene, this.camera)
      this.animateSprite(this.spriteTexture, 9, 1)
      requestAnimationFrame( this.animate )
    },
    render () {
      if (this.rightPressed) {
        this.lastKeyPressed = 68
        if (this.currentTile == 8) {
          this.currentTile = 0;
        }else {
          this.currentTile = this.currentTile + 1
        }
        // this.moveSpriteRight()
      }else if (this.leftPressed) {
        this.lastKeyPressed = 65
        if (this.currentTile == 8 ) {
          this.currentTile = 0;
        }else {
          this.currentTile = this.currentTile + 1
        }
        // this.moveSpriteLeft()
      }

      document.addEventListener("keydown", this.keyPressed, false);
      document.addEventListener("keyup", this.keyUpped, false);
      // this.animateSprite(this.spriteTexture, 9, 1)

    },
    keyPressed(e){
      if (e.keyCode == '68') {
        this.rightPressed = true;
        this.currentKeyPressed = e.keyCode
        // if (this.currentKeyPressed == 65 ) {
        //   this.currentTile = 0
        //   this.lastKeyPressed = e.keyCode;
          this.moveSpriteRight()
        // }else{
        //   if (this.currentTile >= 8) {
        //     this.currentTile = 0;
        //     this.lastKeyPressed = e.keyCode
        //     this.moveSpriteRight()
        //   }else {
        //     this.currentTile = this.currentTile + 1
        //     this.lastKeyPressed = e.keyCode;
        //     this.moveSpriteRight()
        //   }
        // }

      }
      if (e.keyCode == '65') {
        this.leftPressed = true;
        this.currentKeyPressed = e.keyCode
        // if (this.currentKeyPressed == 68) {
        //   this.currentTile = 10
        //   this.lastKeyPressed = e.keyCode;
          this.moveSpriteLeft()
        // }else{
        //   if (this.currentTile >= 18 || this.currentTile < 10) {
        //     this.currentTile = 10;
        //     this.lastKeyPressed = e.keyCode;
        //     this.moveSpriteLeft()
        //   }else {
        //     this.currentTile = this.currentTile + 1
        //     this.lastKeyPressed = e.keyCode;
        //     this.moveSpriteLeft()
        //   }
        // }
      }
    }
  },
  mounted() {
    let clock = new THREE.Clock();
    let delta = clock.getDelta()
    this.init()
    this.animate(delta)
  }
}
</script>

<style>
</style>

