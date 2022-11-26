<template>
  <div id="BattlePuck" style="position: absolute;" >
    <p>BattlePuck</p>
    <h2 style="position:absolute; color:white;">{{ ballData }}</h2>
    <canvas class="webgl" style=""></canvas>
  </div>
</template>
<script>
import * as THREE from 'three'


export default {
  name: 'BattlePuck',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      playerPaddle: null,
      canvas: null,
      puckVectorX: null,
      puckVectorZ: null,
      gameStart: false,
      leftPressed: null,
      rightPressed: null,
      initTime: Date.now(),
      deltaTime: null,
      zLimitEast: 500,
      zLimetWest: -500,
      ballData: null,
      puckRadius: 25,
      newGame: true,
      clock: new THREE.Clock(),
      oldElapsedTime: 0
    }
  },
  methods: {
    addGridHelper () {
      const gridHelper = new THREE.GridHelper(1000, 12);
      this.scene.add(gridHelper);
    },
    addCamera() {
      this.camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight, 0.1, 2000 );
      this.camera.position.set(0,2.5,2.5);
      this.camera.lookAt(new THREE.Vector3(-.5,0,0));
      this.camera.position.x= 1000;
      this.camera.position.y= 1000;
    },
    addLights() {
      let ambientLight = new THREE.AmbientLight( 0xf03ff0 );
      let light2 = new THREE.PointLight( 0xffffff );
      this.scene.add( ambientLight, light2 );
    },
    addMeshes() {
      // player paddle
      const playerPaddleGeo = new THREE.BoxGeometry( 25, 25, 150 );
      const playerPaddleMatr = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      this.playerPaddle = new THREE.Mesh( playerPaddleGeo, playerPaddleMatr );
      this.playerPaddle.position.x = 500;
      this.playerPaddle.position.y = 50;
      this.playerPaddle.position.z = 20;
      this.scene.add( this.playerPaddle );

      // opponent Paddle
      const opponentPaddleGeo = new THREE.BoxGeometry( 25, 25, 150 );
      const opponentPaddleMatr = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
      this.opponentPaddle = new THREE.Mesh( opponentPaddleGeo, opponentPaddleMatr );
      this.opponentPaddle.position.x = -500;
      this.opponentPaddle.position.y = 50;
      this.opponentPaddle.position.z = 20;
      this.scene.add( this.opponentPaddle );

      // puck
      const puckGeo = new THREE.SphereGeometry( this.puckRadius, this.puckRadius, this.puckRadius );
      const puckMatr = new THREE.MeshLambertMaterial( { color: 0x000000 } );
      this.puck = new THREE.Mesh( puckGeo, puckMatr );
      this.puck.position.x = 0;
      this.puck.position.y = 50;
      this.puck.position.z = 20;
      this.scene.add( this.puck );
    },
    returnRandom(number) {
      const random = Math.random() * number;
      return Math.floor(random)
    },
    puckPhysics(x) {
      let puckX = this.puck.position.x
      let puckZ = this.puck.position.z
      let puckSpeed = x;

      // Random direction for puck drop
      if (this.gameStart === true) {
        this.puckVectorZ = null;
        this.ballData = this.puckVectorZ
        this.puckVectorX = this.returnRandom(2);
        this.gameStart = false;
        this.newGame = false;
      }

      // Opponent Wall Collision
      // Will be updated to opponent paddle position one ai is written
      if (this.puckVectorX === 1) {
         puckX -= puckSpeed
        if ( puckX <= -500 ){
          this.puckVectorX = 0
          this.puckVectorZ = this.returnRandom(2);
          this.ballData = this.puckVectorZ
          puckZ -= puckSpeed * (this.returnRandom(2) * -1)*(Math.random() * 3)
        }
      // Player paddle collision
      } else if (this.puckVectorX === 0) {
        puckX += puckSpeed
        if ( ( puckZ <= this.playerPaddle.position.z+50 && puckZ >= (this.playerPaddle.position.z-50) ) && puckX >= this.playerPaddle.position.x - this.puckRadius ) {
          this.puckVectorX = 1;
          this.puckVectorZ = this.returnRandom(2);
          puckZ += puckSpeed * (this.returnRandom(2) * -1)*(Math.random() * 3)
      // Puck out of bounds on player side.
        } else if ( puckX > 550 ) {
          puckZ = 0;
          puckX = 0;
          this.gameStart = false;
          this.newGame = true;
          this.puckVectorX = null;
          this.puckVectorZ = null;
        }
      }

      if (this.puckVectorZ === 1) {
         puckZ -= puckSpeed
        if ( puckZ <= -500 ){
          this.puckVectorZ = 0
          this.puckVectorZ = 0
          puckZ += puckSpeed * (this.returnRandom(2) * -1)*(Math.random() * 3);
        }
      } else if (this.puckVectorZ === 0) {
        puckZ += puckSpeed
        if ( puckZ >= 500 ){
          this.puckVectorZ = 1
          puckZ -= puckSpeed * (this.returnRandom(2) * -1)*(Math.random() * 3);
        }
      }
      this.puck.position.x = puckX;
      this.puck.position.z = puckZ;
    },
    keyDownHandler(e) {
      if (e.keyCode == 37) {
        this.rightPressed = true;
      } else if (e.keyCode == 39) {
        this.leftPressed = true;
      } else if ( e.keyCode == 32 && this.newGame === true) {
        this.gameStart = true;
        this.newGame === false
      }
    },
    keyUpHandler(e) {
      if (e.keyCode == 37) {
        this.rightPressed = false;
      } else if (e.keyCode == 39) {
        this.leftPressed = false;
      }
    },
    movePlayerPaddle(x) {
      if (this.rightPressed === true && this.playerPaddle.position.z < 400) {
        this.playerPaddle.position.z += x
      } else if (this.leftPressed === true && this.playerPaddle.position.z > -400) {
        this.playerPaddle.position.z -= x
      }
    },
    init() {
      this.canvas = document.querySelector('canvas.webgl');
      this.scene = new THREE.Scene()
      this.addGridHelper();
      this.addCamera();
      this.addLights();
      this.addMeshes();

      // renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement)
    },
    animate() {
      requestAnimationFrame( this.animate );

      // Time
      let elapsedTime = this.clock.getElapsedTime()
      this.deltaTime = elapsedTime - this.oldElapsedTime
      this.oldElapsedTime = elapsedTime
      // const currentTime = Date.now()
      // this.deltaTime = currentTime - this.initTime
      // this.initTime = currentTime
      console.log("delta", this.deltaTime*100)

      // Update objects
      // let puckVelocity =  0.01 * this.deltaTime;
      document.addEventListener("keydown", this.keyDownHandler);
      document.addEventListener("keyup", this.keyUpHandler);
      this.puckPhysics(this.deltaTime * 1000);
      this.movePlayerPaddle(this.deltaTime * 1000);
      this.render();
      this.renderer.render( this.scene, this.camera );
    },
    render() {
      this.camera.lookAt( this.scene.position );
    }
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>

<style scoped lang="css">
  .webgl {
    background: url('https://media.istockphoto.com/photos/underwater-scene-tropical-seabed-with-reef-and-sunshine-picture-id1152237432?k=20&m=1152237432&s=612x612&w=0&h=7oGt9q8j0U0pIvuRGqU74wiGZAJWvRH5S8VYQjZLppE=');
    margin: 0px auto;
    width: 100vw !important;
    height: 100vh !important;
    background-size: cover !important;
    background-repeat: no-repeat;
  }
</style>