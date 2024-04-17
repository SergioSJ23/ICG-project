
var Harvest = (function () {
	
    // Instance stores a reference to the Singleton
    var instance;
  
    function startGame() {
  
      // Singleton
  
      var camera, scene, renderer;
      var geometry, material, mesh;

	  let camera2;

      var controls;
      var boxes = [];
      var objects = [];
	  var spotLight;
      var WON = false;
      var timer;
      
  
  
      init();
      animate();
  
      var prevTime = performance.now();
      var velocity = new THREE.Vector3();
  
  
      function init() {
			
  
			initialiseTimer();
			eventHandlers();
			scene = new THREE.Scene();
			
			//add light
			var light = new THREE.DirectionalLight( 0x111111, 0.1 );
			light.position.set( 0, 1, 1 ).normalize();
			scene.add(light);


	
			// Floor
			var floorWidth = 20000;
			var floorHeight = 20000;
	
			var textureLoader = new THREE.TextureLoader();
			textureLoader.load('ground.jpg', function (texture) {
				// Criar o material com a textura carregada
				var material = new THREE.MeshLambertMaterial({
					map: texture, // atribuir a textura carregada ao material
					side: THREE.DoubleSide // garantir que o plano seja visível de ambos os lados
				});
				
				// Criar a geometria do plano
				var geometry = new THREE.PlaneGeometry(floorWidth, floorHeight);
				geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	
				// Criar o mesh do plano com a geometria e o material
				var floorMesh = new THREE.Mesh(geometry, material);
				floorMesh.receiveShadow = true;
				objects.push(floorMesh);
				scene.add(floorMesh);
			});
			  
			// Trees
			var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
			var trunkTexture = new THREE.TextureLoader().load("trunk_texture.jpg");
			var trunkMaterial = new THREE.MeshLambertMaterial({ map: trunkTexture });

			for (var i = 0; i < 80; i++) {
				var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);

				// Randomize foliage size
				var foliageHeight = Math.random() * 100 + 100; // Random height for the foliage
				var foliageRadius = Math.random() * 40 + 20; // Random radius for the foliage

				var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
				var foliageTexture = new THREE.TextureLoader().load("leaves_texture.jpg");
				var foliageMaterial = new THREE.MeshLambertMaterial({ map: foliageTexture });

				var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
				treeFoliage.position.y = 50 + foliageHeight / 2;
				treeTrunk.add(treeFoliage);

				// Randomize tree position
				treeTrunk.position.x = Math.floor(Math.random() * 200 - 100) * 20;
				treeTrunk.position.y = 0; // Adjust the y position according to your scene
				treeTrunk.position.z = Math.floor(Math.random() * 200 - 100) * 20;

				scene.add(treeTrunk);
				objects.push(treeTrunk);
			}

  
  
			camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 9000 );
			camera2  = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
			camera2.position.z = camera.position.z - 1;
			camera2.position.y = camera.position.y;
			camera2.position.x = camera.position.x;
			scene.add( camera2 );

			spotLight = new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI * 0.33);
			camera.add(spotLight);
			camera.add(spotLight.target);
			
			spotLight.target.position.z = - 1;

  
			controls = new THREE.PointerLockControls( camera, 100, 30, true, objects );
			scene.add( controls.getPlayer() );
	
			renderer = new THREE.WebGLRenderer({ antialias: true }); //new THREE.WebGLRenderer();
			renderer.setClearColor( 0xffffff );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			ScreenOverlay(controls); //
			document.body.appendChild( renderer.domElement );

			
  
      }

	  //make a flashlight that follows the camera
	  // Inside the Harvest module
function initFlashlight(camera) {
    // Create flashlight geometry
    var flashlightGeometry = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 6, 1);
    flashlightGeometry.position.set(0, 0, 0); // Position it at the origin
    flashlightGeometry.target.position.set(0, 0, -1); // Target straight ahead

    // Add the flashlight to the camera
    camera.add(flashlightGeometry);
}



function animate() {
  
	requestAnimationFrame( animate );

	if ( controls.enabled ) {

		controls.updateControls();

	}
	renderer.render( scene, camera );

}
  
function randomTexture(maxTextures) {
	return Math.floor(Math.random() * maxTextures) + 1;
}

function initialiseTimer() {
	var sec = 0;
	function pad ( val ) { return val > 9 ? val : "0" + val; }

	timer = setInterval( function(){
		document.getElementById("seconds").innerHTML = String(pad(++sec%60));
		document.getElementById("minutes").innerHTML = String(pad(parseInt(sec/60,10)));
	}, 1000);
}

function eventHandlers() {

	// Keyboard press handlers
	var onKeyDown = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, true); };
	var onKeyUp = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, false); };
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	// Resize Event
	window.addEventListener( 'resize', onWindowResize, false );
}

// HANDLE KEY INTERACTION
function handleKeyInteraction(keyCode, boolean) {
	var isKeyDown = boolean;

	switch(keyCode) {
		case 38: // up
		case 87: // w
			controls.movements.forward = boolean;
			break;

		case 40: // down
		case 83: // s
			controls.movements.backward = boolean;
			break;

		case 37: // left
		case 65: // a
			controls.movements.left = boolean;
			break;

		case 39: // right
		case 68: // d
			controls.movements.right = boolean;
			break;

		case 32: // space
			if (!isKeyDown) {
				controls.jump();
			}
			break;

		case 16: // shift
			controls.walk(boolean);
			break;

		case 67: // crouch (CTRL + W etc destroys tab in Chrome!)
			controls.crouch(boolean);

	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function fallingBoxes(cube, pos, delay) {
	//console.log(cube,pos,delay)
	setTimeout(function() { cube.position.setY(pos); }, delay);
}

return {
	// Public methods and variables
		
		setJumpFactor: function (setJumpFactor) {
			jumpFactor = setJumpFactor;
		}

	};

	};

return {

// Get the Singleton instance if one exists
// or create one if it doesn't
getInstance: function () {

	if ( !instance ) {
		instance = startGame();
	}

	return instance;
		}

	};

})();

harvest = Harvest.getInstance();
