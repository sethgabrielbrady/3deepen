<template>
  <div id="container">
    <p>Breakout</p>
  </div>
</template>
<script>
import * as THREE from 'three'
import DragControls from 'three-dragcontrols';


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
      paddleWidth: null,
      binary: (Math.random() * 2) + 1,
      zRND: Math.random() * 500,
      test: null,
      sc: 0, //score
      target: null,
      paddleX: null,
      paddleY: null,
      paddleZ: null,
      dcontrols: null
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

      let targetGeo = new THREE.BoxGeometry( 15, 50, 130 );
      let targetMatr = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      this.target = new THREE.Mesh( targetGeo, targetMatr );
      this.target.position.x = -480;
      this.target.position.y = 50;
      this.target.position.z = 20;
      this.scene.add( this.target );

      let ballGeo = new THREE.BoxGeometry( 50, 25, 50 );
      let ballMatr = new THREE.MeshBasicMaterial( { color: 0x000000 } );
      this.ball = new THREE.Mesh( ballGeo, ballMatr );
      this.ball.position.x = -500;
      this.ball.position.y = 50;
      this.ball.position.z = this.zRND;
      this.scene.add( this.ball );

      let shotGeo = new THREE.BoxGeometry( 25, 25, 25 );
      let shotMatr = new THREE.MeshBasicMaterial( { color: 0x000000 } );
      this.shot = new THREE.Mesh( shotGeo, shotMatr );
      this.shot.position.x = 500;
      this.shot.position.y = 50;
      this.shot.position.z = 0;
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

      console.log("this.renderer.domElement",this.renderer.domElement)
      document.body.appendChild(this.renderer.domElement)


      // window.addEventListener( 'resize', onWindowResize, false );

    },
    animate: function() {
      requestAnimationFrame( this.animate );
      this.render();
      this.renderer.render(this.scene, this.camera)
    },
    col: function() {

      this.ball.position.x += this.dx;
      this.ball.position.z += this.dy;

      // if ballx is greater than paddle x && ballx is less than paddle x minus 170
      if( this.ball.position.x > this.paddle.position.x &&
        this.ball.position.z <= this.paddle.position.z + 80 &&
        this.ball.position.z >= this.paddle.position.z - 80 ) {
        this.dx = -this.dx;
        this.dy = this.dy + (Math.random() * 10);
      }
      if( this.ball.position.x > this.shot.position.x &&
        this.ball.position.z <= this.shot.position.z + 20 &&
        this.ball.position.z >= this.shot.position.z - 20 ) {
        this.sc += 1;
        console.log(this.sc);
        this.dx = -this.dx;
        this.dy = this.dy + (Math.random() * 10);
      }

      if(this.ball.position.x + this.dx <= this.ballRadius -500) {
        this.dx = -this.dx;
      }
      if (this.ball.position.z <= -500 + this.ballRadius || this.ball.position.z >= 500 - this.ballRadius){
        this.dy = -this.dy;
      }
    },
    render: function() {

      if((this.paddle.position.z < 500-70) && (this.paddle.position.z < 500-70) ) {
        this.dcontrols = new DragControls( [this.paddle, this.shot], this.camera, this.renderer.domElement );

        this.dcontrols.addEventListener( 'dragstart', function (event) {
          console.log("X = ", this.paddleX = event.object.position.x);
          console.log("Y = ", this.paddleX = event.object.position.y);
          console.log("Z = ", this.paddleX = event.object.position.z);
          // event.object.material.color( 0xaaaaaa );
        } );
        this.dcontrols.addEventListener( 'dragend', function (event) {
          console.log("X = ", this.paddleX = event.object.position.x);
          console.log("Y = ", this.paddleX = event.object.position.y);
          console.log("Z = ", this.paddleX = event.object.position.z);
        } );
      }else {
        this.dcontrols = null
        this.dcontrols.removeEventListener( 'dragstart')
        this.dcontrols.removeEventListener( 'dragend')
      }

      if(this.rightPressed && this.paddle.position.z < 500-70) {
        this.paddle.position.z += 14;
        this.shot.position.z = this.paddle.position.z;
      } else if(this.leftPressed && this.paddle.position.z > -500 + 70) {
        this.paddle.position.z -= 14;
        this.shot.position.z = this.paddle.position.z;
      }


      if(this.upPressed === true) {
        // console.log(target.position.z, shot.position.x);
        this.target.position.y = 100;
        this.shot.position.z = this.test;
        this.shot.position.x -= 28;
        // if(shot.position.x === target.position.x && shot.position.z === target.position.z ){
        //   // target.position.y = -1700;
        // }
      }
      if (this.shot.position.x <= -500){
        this.shot.position.x = 500;
        this.upPressed = false;
      }


      this.col();
      if (this.binary === 1){
        this.zRND = this.zRND * -1;
      }else {
        this.zRND;
      }

      // console.log(this.binary);
      // console.log("paddle z",this.paddle.position.z);
      // console.log("paddle x",this.paddle.position.x);
      // console.log("ball z", this.ball.position.z);
      // console.log("ball x",this.ball.position.x);

      if (this.ball.position.x > this.paddle.position.x + 100){
        this.ball.position.x = -500;
        this.ball.position.z = Math.random() * 500;
        this.dx = 10;
        this.dy =-10;
      }

      // unset this for rotating camera
      // const timer = Date.now() * 0.0001;
      // this.camera.position.x = Math.cos(timer) * 800;
      // this.camera.position.z = Math.sin(timer) * 800;
      this.camera.lookAt( this.scene.position );
      this.renderer.render( this.scene, this.camera );

      // listed for up paddle movement
      document.addEventListener("keydown", this.keyDownHandler, false);
      document.addEventListener("keyup", this.keyUpHandler, false);
    },
    keyDownHandler: function(e) {
      if(e.keyCode == 37) {
        this.rightPressed = true;
      }
      else if(e.keyCode == 39) {
        this.leftPressed = true;
      }
      else if(e.keyCode == 38) {
        this.upPressed = true;
        this.test = this.paddle.position.z;
      }
    },
    keyUpHandler: function(e) {
      if(e.keyCode == 37) {
        this.rightPressed = false;
      }
      else if(e.keyCode == 39) {
        this.leftPressed = false;
      }
      else if(e.keyCode == 38) {
        console.log(this.test);
      }
    }
  },
  watch: {

  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>