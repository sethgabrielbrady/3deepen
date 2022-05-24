<template>
  <div id="Twinstick">
    <p>Twinstick</p>
  </div>
</template>
<script>
import * as THREE from 'three'
// import DragControls from 'three-dragcontrols';


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
      ball: null,
      shot: null,
      paddle: null,
      upWall: null,
      // canvas: document.getElementById("container"),
      gridHelper: null,
      dx: 10,
      dy: -10,
      ballRadius: 12.5,
      rightPressed: null,
      leftPressed: null,
      upPressed: null,
      downPress: null,
      shotUpPressed: null,
      shotDownPressed: null,
      shotLeftPressed: null,
      shotRightPressed: null,
      paddleWidth: null,
      binary: (Math.random() * 2) + 1,
      zRND: Math.random() * 500,
      test: null,
      sc: 0, //score
      target: null,
      paddleX: null,
      paddleY: null,
      paddleZ: null,
      dcontrols: null,
      shotFired: 0,
      shotMatr: null,
      shotPressed: false
    }
  },
  methods: {
    init: function() {

     //camera
     this.camera = new THREE.PerspectiveCamera(50,
      window.innerWidth/window.innerHeight, 0.1, 2000 ); // Specify camera type like this
      this.camera.position.set(0,2.5,2.5); // Set position like this
      this.camera.lookAt(new THREE.Vector3(-.5,0,0)); // Set look at coordinate like this

      this.camera.position.x= 1000;
      this.camera.position.y= 1000;
      // this.camera.position.x = 1.5633;




      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xf0f0f0 );


      // Grid
      this.gridHelper = new THREE.GridHelper(1000, 12);
      this.scene.add( this.gridHelper );

      //paddle
      const paddleGeo = new THREE.BoxGeometry( 50, 50, 70 );
      const paddleMatr = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      this.paddle = new THREE.Mesh( paddleGeo, paddleMatr );
      this.paddle.position.x = 500;
      this.paddle.position.y = 50;
      this.paddle.position.z = 20;
      this.scene.add( this.paddle );
      this.scene.add( this.target );



      let shotGeo = new THREE.BoxGeometry( 25, 25, 25 );
      this.shotMatr = new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0  } );
      this.shot = new THREE.Mesh( shotGeo, this.shotMatr);
      this.shot.position.x = 5000;
      this.shot.position.y = -50;
      this.shot.position.z = 20;
      this.scene.add( this.shot );


      // Lights
      let ambientLight = new THREE.AmbientLight( 0xf03ff0 );
      this.scene.add( ambientLight );

      let light2 = new THREE.PointLight( 0xffffff );
      this.scene.add(light2);

      // renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      document.body.appendChild(this.renderer.domElement)


      // window.addEventListener( 'resize', onWindowResize, false );

    },
    setShotPos () {
      this.shot.position.z = this.paddle.position.z
      this.shot.position.x = this.paddle.position.x;
      this.shotFired = 1;
    },
    animate: function() {
      requestAnimationFrame( this.animate );
      this.render();
      this.renderer.render(this.scene, this.camera)
    },
    render: function() {
      if (this.rightPressed && this.paddle.position.z < 500-70) {
        this.paddle.position.z += 14;
      } else if(this.leftPressed && this.paddle.position.z > -500 + 70) {
        this.paddle.position.z -= 14;
      }else if(this.upPressed && this.paddle.position.x > -500 + 70) {
        this.paddle.position.x -= 14;
      }else if(this.downPressed && this.paddle.position.x > -500 + 70) {
        this.paddle.position.x += 14;
      }
      if(this.shotUpPressed ) {
        if (this.shotFired === 0) {
          this.setShotPos()
          if( this.shot.position.x > -500){
            this.shot.position.x -= 40
          }
        }
      }
      // if(this.shotDownPressed ) {
      //   if (this.shotFired === 0) {
      //     this.setShotPos()
      //   }
      //   if( this.shot.position.x < -500){
      //     this.shot.position.x += 40
      //   }
      // }

      // if(this.shotDownPressed ) {
      //   if (this.shotFired === 0) {
      //     this.setShotPos()
      //   }
      //   if( this.shot.position.x > -500){
      //     this.shot.position.x -= 40
      //   }
      // }
      // if(this.shotDownPressed ) {
      //   if (this.shotFired === 0) {
      //     this.setShotPos()
      //   }
      //   if( this.shot.position.x > -500){
      //     this.shot.position.x -= 40
      //   }
      // }

      if (this.shot.position.x < -500){
        this.shot.position.x = 50000
        this.shotPressed = false;
        this.shotFired = 0;
      }
      if (this.shot.position.x < -500){
        this.shot.position.x = 50000
        this.shotPressed = false;
        this.shotFired = 0;
      }

      this.camera.lookAt( this.scene.position );
      this.renderer.render( this.scene, this.camera );

      // listed for up paddle movement
      document.addEventListener("keydown", this.keyDownHandler, true);
      document.addEventListener("keyup", this.keyUpHandler, false);
    },
    keyDownHandler: function(e) {
      if (e.keyCode == 65) {
        this.rightPressed = true;
      }
      else if (e.keyCode == 68) {
        this.leftPressed = true;
      }
      else if (e.keyCode == 87) {
        this.upPressed = true;
      }
       else if (e.keyCode == 83) {
        this.downPressed = true;
      }
      else if (e.keyCode == 73 ) {
        this.shotUpPressed = true
      }
      else if (e.keyCode == 74) {
        this.shotRightPressed = true;
      }
      else if (e.keyCode == 76) {
        this.shotLeftPressed = true;
      }
      else if (e.keyCode == 75) {
        this.shotDownPressed = true;
      }
    },
    keyUpHandler: function(e) {
      if (e.keyCode == 65) {
        this.rightPressed = false;
      }
      else if (e.keyCode == 68) {
        this.leftPressed = false;
      }
      else if (e.keyCode == 87) {
        this.upPressed = false;
      }
      else if (e.keyCode == 83) {
        this.downPressed = false;
      }
      //
    }
  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>