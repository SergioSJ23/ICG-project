
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
	  var ambientSound = new Audio('ambience.mp3');
	  var screamSound = new Audio('scream.mp3');
	  var pageSound = new Audio('page.mp3');
      
  
  
      init();
      animate();
  
      var prevTime = performance.now();
      var velocity = new THREE.Vector3();
  
  
      function init() {
			
  
			initialiseTimer();
			eventHandlers();
			scene = new THREE.Scene();
			
			//every 60 secs play a scream sound
			screamSound.volume = 1.0;
			setInterval(function() {
				screamSound.play();
			}, 60000);
			

	
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
			window.addEventListener('load', function() {
				document.getElementById('loading-screen').style.display = 'none';
			});

			//make a static tree
			var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
			var trunkTexture = new THREE.TextureLoader().load("trunk.jpg");
			//standard material
			var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
			var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
			treeTrunk.castShadow = true; //default is false
			treeTrunk.receiveShadow = false; //default
			objects.push(treeTrunk);
			// Randomize foliage size
			var foliageHeight = 200; // Random height for the foliage
			var foliageRadius = 50; // Random radius for the foliage

			var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
			var foliageTexture = new THREE.TextureLoader().load("leaves.jpg");
			//standard material
			var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });

			var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
			treeFoliage.position.y = 50 + foliageHeight / 2;
			treeFoliage.castShadow = true;
			treeFoliage.receiveShadow = false;
			objects.push(treeFoliage);
			treeTrunk.add(treeFoliage);

			treeTrunk.position.x = 0;
			treeTrunk.position.y = 0; // Adjust the y position according to your scene
			treeTrunk.position.z = -500;

			//add tree to scene
			scene.add(treeTrunk);


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

			var page = addPageToScene(3100,10, 3431);
			var page2 = addPageToScene(-3175, 10, -3319);
			var page3 = addPageToScene(-3350, 420, -3345);
			var page4 = addPageToScene(0, 10, -490);
			var page5 = addPageToScene(120, 10, 120);
			var page6 = addPageToScene(150, 10, 150);
			var page7 = addPageToScene(180, 10, 180);
			var page8 = addPageToScene(210, 10, 210);
						//add ambient sound lower volume
						ambientSound.volume = 0.05;
						//make sure it plays
						ambientSound.play();
						//loop the sound
						ambientSound.loop = true;

			
			//make the page disappear when the player interacts with it

			const raycaster = new THREE.Raycaster();
			const mouse = new THREE.Vector2();
			const clickMouse = new THREE.Vector2();
			var draggableObjects = THREE.Object3D;
			var counterPage = 0;

			createStairs();
			




			window.addEventListener('click', function() {
				clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				raycaster.setFromCamera(clickMouse, camera);
				var intersects = raycaster.intersectObjects(objects);
				if (intersects.length > 0) {
					if (intersects[0].object === page) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page2) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page2);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page3) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page3);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page4) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page4);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page5) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page5);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page6) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page6);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page7) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page7);
						checkPageCounter(counterPage);
					}
					if (intersects[0].object === page8) {
						counterPage++;
						elementoContagem.innerHTML = "Páginas coletadas: "+counterPage;
						pageSound.play();
						removerPaginaDoMapa(page8);
						checkPageCounter(counterPage);
					}

				}
			});


			//page counter on screen
			var elementoContagem = document.createElement('div');
			elementoContagem.style.position = 'absolute';
			elementoContagem.style.width = 100;
			elementoContagem.style.height = 100;
			elementoContagem.style.backgroundColor = "black";
			elementoContagem.style.color = "white";
			elementoContagem.style.top = 10 + 'px';
			elementoContagem.style.left = 10 + 'px';
			elementoContagem.style.zIndex = 1;
			elementoContagem.style.textAlign = 'center';
			elementoContagem.style.fontSize = '20px';
			//update the counter
			elementoContagem.innerHTML = "Páginas coletadas: 0"
			document.body.appendChild(elementoContagem);
			

			var ambientLight = new THREE.AmbientLight(0x404040, 0.08);
			scene.add(ambientLight);

			//add event listener to the window to check if timer is at 6 seconds
			window.addEventListener('load', function() {
				//wait 6 secs the call endGame function
				setTimeout(endGame, 300000);


			});

			

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

			//cenário 2

			const stairs = new THREE.Group();
			const stepWidth = 60; // Largura do degrau
			const stepHeight = 10; // Altura do degrau
			var stepDepth = 50; // Profundidade do degrau
			let currentHeight = 0;
			const totalStepsPerSide = 5; // Quantos degraus por lado
			const totalSides = 8 // Quantos lados tem a escada quadrada
			
			// Criar os degraus em cada lado do quadrado
			for (let side = 0; side < totalSides; side++) {
			  for (let i = 0; i < totalStepsPerSide; i++) {

				const stepGeometry = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth);
				const stepTexture = new THREE.TextureLoader().load('wood2.jpg');
				const stepMaterial = new THREE.MeshLambertMaterial({ map: stepTexture});
				const step = new THREE.Mesh(stepGeometry, stepMaterial);
				objects.push(step);
			
				let xPosition = 0;
				let zPosition = 0;
			
				// Posicionar os degraus com base no lado atual da escada
				switch (side) {
				  case 0: // Lado 1
					xPosition = i * stepWidth;
					zPosition = 0;
					break;
				  case 1: // Lado 2
					xPosition = totalStepsPerSide * stepWidth;
					zPosition = i * stepDepth;
					break;
				  case 2: // Lado 3
					xPosition = totalStepsPerSide * stepWidth - i * stepWidth;
					zPosition = totalStepsPerSide * stepDepth;
					break;
				  case 3: // Lado 4
					xPosition = 0;
					zPosition = totalStepsPerSide * stepDepth - i * stepDepth;
					break;
				  case 4: // Lado 5
					xPosition = i * stepWidth;
					zPosition = 0;
					break;
				  case 5: // Lado 6
					xPosition = totalStepsPerSide * stepWidth;
					zPosition = i * stepDepth;
					break;
				  case 6: // Lado 7	
					xPosition = totalStepsPerSide * stepWidth - i * stepWidth;
					zPosition = totalStepsPerSide * stepDepth;
					break;
				  case 7: // Lado 8
					xPosition = 0;
					zPosition = totalStepsPerSide * stepDepth - i * stepDepth;
					break;
				}
			
				step.position.set(xPosition, currentHeight, zPosition);
				stairs.add(step);
				currentHeight += stepHeight; // Incrementar a altura para o próximo degrau
			  }
			}
			
			// Posicione a escada inteira, se necessário
			stairs.position.set(0, 0, 0);
			
			// Adicione a escada à cena


			// Profundidade das pernas da torre
			const legOffset = -25; // Quão para dentro as pernas estarão da ponta dos degraus
			const legHeight = 400; // Altura total das pernas igual à altura total da escada
			const legWidth = 10; // Largura das pernas da torre
			const legDepth = 10; // Profundidade das pernas da torre

			// Criar as pernas
			for (let i = 0; i < 4; i++) {
			const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
			const legtexture = new THREE.TextureLoader().load('wood.jpg');
			const legMaterial = new THREE.MeshLambertMaterial({ map: legtexture});
			const leg = new THREE.Mesh(legGeometry, legMaterial);

			let xPosition = (i % 2) * ((totalStepsPerSide - 1) * stepWidth + legOffset) - legOffset; // X
			let zPosition = Math.floor(i / 2) * ((totalStepsPerSide - 1) * stepDepth + legOffset) - legOffset; // Z

			leg.position.set(xPosition, legHeight / 2, zPosition);
			stairs.add(leg); // Adicionar as pernas ao grupo de escadas para manter tudo junto
			}



			// Ajustar a posição da escada e do conjunto torre de vigia
			//ROTATE 180 ON Y WITHOUT CHANGING PLACE
			stairs.rotation.y = Math.PI;
			stairs.position.set(-totalStepsPerSide * stepWidth / 2-3000, 0, -totalStepsPerSide * stepDepth / 2-3000);

			// Adicionar a torre de vigia à lista de objetos para interações futuras
			objects.push(stairs);



			var house = new THREE.Group();

			// Parâmetros da casa
			var houseWidth = 230;
			var houseHeight = 200;
			var houseDepth = 230;

			// Texturas e materiais
			var wallTexture = new THREE.TextureLoader().load('watchtower.jpg');
			var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
			var floorTexture = new THREE.TextureLoader().load('floor.jpg');
			var floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });

			// Paredes
			var wall1Geometry = new THREE.BoxGeometry(houseWidth, houseHeight, 10);
			var wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
			wall1.position.set(0, houseHeight / 2, houseDepth / 2+2);
			objects.push(wall1);
			house.add(wall1);

			// Paredes laterais com espaço para porta
			var doorWidth = 80; // Largura da porta
			var wallSideGeometry = new THREE.BoxGeometry(10, houseHeight, 140);
			var wall2 = new THREE.Mesh(wallSideGeometry, wallMaterial);
			wall2.position.set(-houseWidth / 2, houseHeight / 2, 45);
			objects.push(wall2);
			house.add(wall2);


			var wallSideGeometry = new THREE.BoxGeometry(10, houseHeight, 40);
			var wall3 = new THREE.Mesh(wallSideGeometry, wallMaterial);

			wall3.position.set(-houseWidth / 2, houseHeight / 2, -90);
			objects.push(wall3);
			house.add(wall3);

			//wall4 on top and between the two walls	
			var wall4Geometry = new THREE.BoxGeometry(10, houseHeight/3, 60);
			var wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
			wall4.position.set(-houseWidth / 2, houseHeight-33, -52);
			objects.push(wall4);
			house.add(wall4);

			//clone wall 1
			var wall5 = wall1.clone();
			wall5.position.set(0, houseHeight / 2, -houseDepth / 2);
			objects.push(wall5);
			house.add(wall5);

			var wall6Geoçmetry = new THREE.BoxGeometry(10, houseHeight, houseDepth);
			var wall6 = new THREE.Mesh(wall6Geoçmetry, wallMaterial);
			wall6.position.set(houseWidth / 2-4, houseHeight / 2, 0);
			objects.push(wall6);
			house.add(wall6);

			// Chão
			var floorGeometry = new THREE.BoxGeometry(houseWidth, 10, houseDepth);
			var floorTexture = new THREE.TextureLoader().load('floor.jpg');
			var floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
			var floor = new THREE.Mesh(floorGeometry, floorMaterial);
			floor.position.set(0, 5, 0); // Eleva levemente o chão para evitar z-fighting
			objects.push(floor);
			house.add(floor);

			// Telhado
			var roofGeometry = new THREE.PlaneGeometry(houseWidth, houseDepth);
			var roofMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
			var roof = new THREE.Mesh(roofGeometry, roofMaterial);
			roof.rotation.x = Math.PI / 2;
			roof.position.y = houseHeight;
			objects.push(roof);
			house.add(roof);

			// Paredes internas com espaço para porta
			var wallInteriorGeometry = new THREE.BoxGeometry(10, houseHeight, (houseDepth - doorWidth) / 2 +10);
			var wallInterior1 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
			wallInterior1.position.set(0, houseHeight / 2, doorWidth);
			house.add(wallInterior1);

			var wallInterior2 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
			wallInterior2.position.set(0, houseHeight / 2, -(doorWidth));
			house.add(wallInterior2);
			
			
			// Posicionar a casafrente tras e lado
			house.position.set(-3280, 390, -3240);
			house.rotation.y = Math.PI;

			// Adicionar a casa à cena
			scene.add(house);
			scene.add(stairs);

			// Cenario 3

 
			


			

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
	  

	function removerPaginaDoMapa(pagina) {
		// Remove a página da cena
		scene.remove(pagina);
		// Remove a página do array de objetos
		objects = objects.filter(function (obj) {
			return obj !== pagina;
		});
	}



//make stairs that go up in a square shape
function createStairs() {
	var stairs = new THREE.Group();
	var stairWidth = 100;
	var stairHeight = 10;
	var stairDepth = 50;
	var stairTexture = new THREE.TextureLoader().load('wall_texture.jpg');
	var stairMaterial = new THREE.MeshStandardMaterial({ map: stairTexture });

	for (var i = 0; i < 10; i++) {
		var stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
		var stair = new THREE.Mesh(stairGeometry, stairMaterial);
		stair.position.set(0, i * stairHeight, i * stairDepth);
		stairs.add(stair);
		objects.push(stair);
	}

	for (var i = 0; i < 10; i++) {
		var stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
		var stair = new THREE.Mesh(stairGeometry, stairMaterial);
		stair.position.set(i * stairWidth, i * stairHeight, 10 * stairDepth);
		stairs.add(stair);
		objects.push(stair);
	}

	for (var i = 0; i < 10; i++) {
		var stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
		var stair = new THREE.Mesh(stairGeometry, stairMaterial);
		stair.position.set(10 * stairWidth, i * stairHeight, 10 * stairDepth - i * stairDepth);
		stairs.add(stair);
		objects.push(stair);
	}

	for (var i = 0; i < 10; i++) {
		var stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
		var stair = new THREE.Mesh(stairGeometry, stairMaterial);
		stair.position.set(10 * stairWidth - i * stairWidth, i * stairHeight, 0);
		stairs.add(stair);
		objects.push(stair);

	}
	stairs.position.set(3000, 0, -3000);

	return stairs;
}
	var stairs = createStairs();
	scene.add(stairs);

	function addPageToScene(x,y, z) {
	
			// white page texture
			var pageTexture = new THREE.TextureLoader().load('page1.webp');
			var pageMaterial = new THREE.MeshBasicMaterial({ map: pageTexture });
			//double sided
			pageMaterial.side = THREE.DoubleSide;
		
			// Geometry for the page
			var pageGeometry = new THREE.PlaneGeometry(20, 20); // Adjust size as needed
			var page = new THREE.Mesh(pageGeometry, pageMaterial);
		
			// Position the page in the scene
			page.position.set(x, y, z); // Adjust position as needed

			// Add the page to the scene
			scene.add(page);
		
			// Add the page to the objects array for collision detection
			objects.push(page);
		
			// Return a reference to the page mesh
			return page;
	}



	


function animate() {
  
	requestAnimationFrame( animate );

	if ( controls.enabled ) {

		controls.updateControls();
		updatePlayerCoordinates();

	}
	renderer.render( scene, camera );

}

function updatePlayerCoordinates() {
    if (controls && controls.getPlayer()) {
        var playerPosition = controls.getPlayer().position; // Assume que controls.getPlayer() retorna o objeto THREE.Mesh ou similar do jogador
        var coordsText = `Coordenadas: X=${playerPosition.x.toFixed(2)}, Y=${playerPosition.y.toFixed(2)}, Z=${playerPosition.z.toFixed(2)}`;
        document.getElementById('playerCoords').innerText = coordsText;
    }
}

function checkPageCounter(counterPage) {
	if (counterPage === 8) {
		WON = true;
		clearInterval(timer);
		document.getElementById("game-over").style.display = "block";
		document.getElementById("game-over").innerHTML = "Parabéns! Coletaste todas as páginas! <br> Tempo: " + document.getElementById("minutes").innerHTML + "m " + document.getElementById("seconds").innerHTML + "s <br> Voltando ao menu inicial em 20 segundos...";
		var countDown = 20;
		var countDownTimer = setInterval(function() {
			countDown--;
			document.getElementById("game-over").innerHTML = "Parabéns! Coletaste todas as páginas! <br> Tempo: " + document.getElementById("minutes").innerHTML + "m " + document.getElementById("seconds").innerHTML + "s <br> Voltando ao menu inicial em " + countDown + " segundos...";
			if (countDown <= 0) {
				clearInterval(countDownTimer);
				window.location.href = "index.html";
			}
		}, 1000);
		setTimeout(reloadPage, 20000);
		

	}
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

function endGame() {
	clearInterval(timer);
	document.getElementById("game-over").style.display = "block";
	document.getElementById("game-over").innerHTML = "Game Over! <br> Voltando ao menu inicial em 20 segundos...";
	var countDown = 20;
	var countDownTimer = setInterval(function() {
		countDown--;
		document.getElementById("game-over").innerHTML = "Game Over! <br> Voltando ao menu inicial em " + countDown + " segundos...";
		if (countDown <= 0) {
			clearInterval(countDownTimer);
			window.location.href = "index.html";
		}
	}, 1000);
	setTimeout(reloadPage, 20000);
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

		//press E to interact with objects
		case 69:
			controls.interact();
			break;

	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

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
