<template>
  <div id="container">
    <div style="position:absolute;">
      <button @click="startButton">
        <span v-if="start">Pause</span>
        <span v-else>Start</span>
      </button><br>

    </div>
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
      camera: null,
      scene: null,
      renderer: null,
      ball: null,
      paddle: null,
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
      lastPaddleX: null,
      lastPaddleY: null,
      lastPaddleZ: null,
      dcontrols: null,
      start: false
    }
  },
  methods: {
    startButton () {
      this.start = !this.start
    },
    init: function() {
     //camera
     this.camera = new THREE.PerspectiveCamera(50,
      window.innerWidth/window.innerHeight, 0.1, 2000 ); // Specify camera type like this
      // this.camera.position.set(0,2.5,2.5); // Set position like this
      // this.camera.lookAt(new THREE.Vector3(-.5,0,0)); // Set look at coordinate like this

      this.camera.position.z = 0;
      this.camera.position.y = 1500;
      this.camera.position.x = 500;
      // this.camera.position.x = 0;
      // this.camera.position.z = 110;
      // this.camera.position.y = 5.5585370478817334e-14;

      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color( 0xf0f0f0 );

      // Grid
      this.gridHelper = new THREE.GridHelper(1000, 12);
      this.scene.add( this.gridHelper );

      //paddle
      const paddleGeo = new THREE.BoxGeometry( 50, 50, 200 );
      const paddleMatr = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      this.paddle = new THREE.Mesh( paddleGeo, paddleMatr );
      this.paddle.position.x = 500;
      this.paddle.position.y = 50;
      this.paddle.position.z = 20;
      this.scene.add( this.paddle );

      let ballGeo = new THREE.BoxGeometry( 50, 25, 50 );
      let ballMatr = new THREE.MeshBasicMaterial( { color: 0x000000 } );
      this.ball = new THREE.Mesh( ballGeo, ballMatr );
      this.ball.position.x = -500;
      this.ball.position.y = 50;
      this.ball.position.z = this.zRND;
      this.scene.add( this.ball );

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

    },
    animate: function() {
      requestAnimationFrame( this.animate );
      if (this.start) {
        this.render();
        this.renderer.render(this.scene, this.camera)
      }
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

      if(this.ball.position.x + this.dx <= this.ballRadius -500) {
        this.dx = -this.dx;
      }
      if (this.ball.position.z <= -500 + this.ballRadius || this.ball.position.z >= 500 - this.ballRadius){
        this.dy = -this.dy;
      }
    },
    render: function() {
      this.dcontrols = new DragControls( [this.paddle], this.camera, this.renderer.domElement );
      this.dcontrols.addEventListener( 'dragstart', function () {} );
      this.dcontrols.addEventListener( 'dragend', function () {} );

      if ( this.paddle.position.z < -500 + 70 ){
         this.paddle.position.z = -500
      }
      if ( this.paddle.position.z > 500-70) {
        this.paddle.position.z = 500
      }
      // if ( this.paddle.position.x < -500 + 35 ){
      //    this.paddle.position.x = -500 + 35
      // }
      // if ( this.paddle.position.x > 500-35) {
      //   this.paddle.position.x = 500 + 35
      // }
      if ( this.paddle.position.x != 535) {
        this.paddle.position.x = 535
      }
      if ( this.paddle.position.y != 50) {
        this.paddle.position.y = 50
      }

      // console.log(" X=",this.paddle.position.x, " Y=",this.paddle.position.y, " Z=",this.paddle.position.z)

      this.col();
      if (this.binary === 1){
        this.zRND = this.zRND * -1;
      }else {
        this.zRND;
      }

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
    },
  },
  watch: {

  },
  mounted() {
    this.init()
    this.animate()
  }
}
</script>