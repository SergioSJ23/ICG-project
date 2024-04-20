
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
			
			


	
			// Floor
			const geometry = new THREE.PlaneGeometry(15000, 15000, 32);
			const groundMaterial = new THREE.MeshPhysicalMaterial();
			const plane = new THREE.Mesh(geometry, groundMaterial);

			plane.rotation.x = -Math.PI / 2; // Rodar o plano para que fique horizontal
			plane.position.y = -10; // Posicionar o plano no eixo y
		
			
			plane.material.map = new THREE.TextureLoader().load('ground.jpg');
			plane.material.map.wrapS = THREE.RepeatWrapping;
			plane.material.map.wrapT = THREE.RepeatWrapping;
			plane.material.map.repeat.set(100, 100);
			plane.material.map.anisotropy = 16;
			
			plane.material.map.minFilter = THREE.LinearFilter;
			plane.material.map.magFilter = THREE.LinearFilter;
			plane.receiveShadow = true;


			objects.push(plane);
			scene.add(plane);
						
			// Trees
			

			for (var i = 0; i < 80; i++) {
				var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
				var trunkTexture = new THREE.TextureLoader().load("trunk.jpg");
				//standard material
				var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
				var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
				treeTrunk.castShadow = true; //default is false
				treeTrunk.receiveShadow = false; //default
				// Randomize foliage size
				var foliageHeight = Math.random() * 100 + 100; // Random height for the foliage
				var foliageRadius = Math.random() * 40 + 20; // Random radius for the foliage

				var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
				var foliageTexture = new THREE.TextureLoader().load("leaves.jpg");
				//standard material
				var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });

				var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
				treeFoliage.position.y = 50 + foliageHeight / 2;
				treeFoliage.castShadow = true;
				treeFoliage.receiveShadow = false;

				treeTrunk.add(treeFoliage);




				// Randomize tree position
				treeTrunk.position.x = Math.floor(Math.random() * 200 - 100) * 20;
				treeTrunk.position.y = 0; // Adjust the y position according to your scene
				treeTrunk.position.z = Math.floor(Math.random() * 200 - 100) * 20;

				//tree makes shadow
				treeTrunk.castShadow = true;
				treeTrunk.receiveShadow = false;
				
				

				scene.add(treeTrunk);
				objects.push(treeTrunk);
				objects.push(treeFoliage);
			}

			//background color
			scene.background = new THREE.Color(0x000000);

			var moonTexture = new THREE.TextureLoader().load('moon.png'); // Carregar a textura da lua
			var moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture, side: THREE.FrontSide }); // Material usando a textura da lua
			var moonGeometry = new THREE.SphereGeometry(100, 64, 64); // Geometria esférica para a lua
			var moon = new THREE.Mesh(moonGeometry, moonMaterial); // Criar o objeto da lua
			moon.position.set(0, 6000, 8000); // Posicionar a lua no céu
			scene.add(moon); // Adicionar a lua à cena

			//weak ambient light
			var ambientLight = new THREE.AmbientLight(0x404040, 0.051);
			scene.add(ambientLight);

			/*//add skybox that covers panel
			var skyboxGeometry = new THREE.BoxGeometry(18000, 18000, 18000);
			//WITH IMAGES AS TEXTURES
			var cubeMaterials = [
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_ft.png'), side: THREE.DoubleSide }), // right
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_bk.png'), side: THREE.DoubleSide }), // left
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_up.png'), side: THREE.DoubleSide }), // top
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_dn.png'), side: THREE.DoubleSide }), // bottom
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_rt.png'), side: THREE.DoubleSide }), // front
				new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('space_lf.png'), side: THREE.DoubleSide })  // back
			];
			var skyboxMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
			var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
			scene.add(skybox);*/

			//sphere that cobvers the panel
			/*var skyGeometry = new THREE.SphereGeometry(18000, 32, 32);
			var skyMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('night.jpg')});
			
			var sky = new THREE.Mesh(skyGeometry, skyMaterial);
			sky.material.map.wrapS = THREE.RepeatWrapping;
			sky.material.map.wrapT = THREE.RepeatWrapping;
			sky.material.map.repeat.set(1000, 1000);
			sky.material.map.anisotropy = 160;
			
			

			
			sky.material.side = THREE.BackSide;
			scene.add(sky);*/
			//weak ambient light
			
			var ambientLight = new THREE.AmbientLight(0x404040, 0.08);
			scene.add(ambientLight);

			//cenário 1

			function createBarn() {
				var barn = new THREE.Group();
			
				// Paredes exteriores
				var barnWidth = 1000;
				var barnHeight = 150;
				var barnDepth = 1000;
			
				var wallTexture = new THREE.TextureLoader().load('wall_texture.jpg');
				var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
			
				// Paredes
				var wall1Geometry = new THREE.BoxGeometry(barnWidth, barnHeight, 10);
				var wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
				wall1.position.set(0, barnHeight / 3, barnDepth / 2);
				objects.push(wall1);
				barn.add(wall1);
			
				var wall2Geometry = new THREE.BoxGeometry(10, barnHeight, barnDepth);
				var wall2 = new THREE.Mesh(wall2Geometry, wallMaterial);
				wall2.position.set(-barnWidth / 2, barnHeight / 3, 0);
				objects.push(wall2);
				barn.add(wall2);
			
				var wall3 = wall2.clone();
				wall3.position.x = barnWidth / 2;
				objects.push(wall3);
				barn.add(wall3);
			
				var wall4Geometry = new THREE.BoxGeometry(450, barnHeight, 10);
				var wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
				wall4.position.set(275, barnHeight / 3, -barnDepth / 2);
				objects.push(wall4);
				barn.add(wall4);
			
				var wall5Geometry = new THREE.BoxGeometry(450, barnHeight, 10);
				var wall5 = new THREE.Mesh(wall5Geometry, wallMaterial);
				wall5.position.set(-275, barnHeight / 3, -barnDepth / 2);
				objects.push(wall5);
				barn.add(wall5);
			
				// Telhado
				var roofGeometry = new THREE.PlaneGeometry(barnWidth, barnDepth);
				var roofMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('wall_texture.jpg') });
				var roof = new THREE.Mesh(roofGeometry, roofMaterial);
				roof.rotation.x = Math.PI / 2;
				roof.position.y = barnHeight - 25;
				objects.push(roof);
				barn.add(roof);
			
				// Corredor
				var corridorWidth = 500;
				var corridorHeight = 130;
				var corridorDepth = 500;
			
				var corridorGeometry = new THREE.BoxGeometry(corridorWidth, corridorHeight, corridorDepth);
				var corridor = new THREE.Mesh(corridorGeometry, wallMaterial);
				corridor.position.set(0, corridorHeight / 3, barnDepth/2 - corridorDepth/2 - 70);
				objects.push(corridor);
				barn.add(corridor);

				//wall that splits the barn
				var wall6Geometry = new THREE.BoxGeometry(5, barnHeight, barnDepth);
				var wall6 = new THREE.Mesh(wall6Geometry, wallMaterial);
				wall6.position.set(0, barnHeight / 3, 100);
				objects.push(wall6);
				barn.add(wall6);

			
				return {
					barn: barn
				};
			}
			
			var barnData = createBarn();
			var barn = barnData.barn;
			barn.position.set(3000, 0, 3000);
			objects.push(barn);
			
			scene.add(barn);
			

			camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 5000 );
			camera.position.y = 10;
			camera.position.z = 0;
			camera.rotation.y = Math.PI;

			spotLight = new THREE.SpotLight(0xffffff, 1, 0, 0.7 );
			camera.add(spotLight);
			camera.add(spotLight.target);

			
			
			spotLight.target.position.z = -1;
			spotLight.target.position.y = 1;
			spotLight.target.position.x = 0;
			spotLight.distance = 400;
			spotLight.penumbra = 0.5;

			scene.add(camera);

  
			controls = new THREE.PointerLockControls( camera, 100, 30, true, objects );
			scene.add( controls.getPlayer() );
	
			renderer = new THREE.WebGLRenderer({ antialias: true }); //new THREE.WebGLRenderer();
			renderer.setClearColor( 0xffffff );
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			ScreenOverlay(controls); //
			document.body.appendChild( renderer.domElement );

			
  
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
			controls.run(boolean);
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
