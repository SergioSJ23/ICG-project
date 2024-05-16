
function startGame() {

    var camera, scene, renderer;
    
    var controls;
    var objects = [];
    var spotLight;
    var timer;
    var ambientSound = new Audio('sounds/ambience.mp3');
    var screamSound = new Audio('sounds/scream.mp3');
    var pageSound = new Audio('sounds/page.mp3');
    var scream = new Audio('sounds/jumpscare.mp3');
    var warningSound = new Audio('sounds/leave.mp3');
    var final = new Audio('sounds/final.mp3');
	var isGameActive = false;
  
    
    init();
    animate();
    
    function init() {
         
            eventHandlers();
            scene = new THREE.Scene();
            
            //every 60 secs play a scream sound
            screamSound.volume = 1.0;
            setInterval(function() {
                screamSound.play();
            }, 120000);
    
            ambientSound.volume = 0.2;
            final.volume = 0.8;

			document.addEventListener('click', function activateGame() {
				if (!isGameActive) {  // Se o jogo estiver inativo, ativa no primeiro clique
					isGameActive = true;
					console.log("Jogo ativado.");
					// Remova o ouvinte de evento para garantir que isso aconteça apenas uma vez
					document.removeEventListener('click', activateGame);
					// Chame initialiseTimer para iniciar o timer
					initialiseTimer();
                    setTimeout(endGame, 300000);
                    
                    
				}
			});

            // Floor
            const geometry = new THREE.PlaneGeometry(5000, 5000, 32);
            const groundMaterial = new THREE.MeshPhysicalMaterial();
            const plane = new THREE.Mesh(geometry, groundMaterial);
    
            plane.rotation.x = -Math.PI / 2; // Rodar o plano para que fique horizontal
            plane.position.y = -10; // Posicionar o plano no eixo y
        
            
            plane.material.map = new THREE.TextureLoader().load('imgs/ground.jpg');
            plane.material.map.wrapS = THREE.RepeatWrapping;
            plane.material.map.wrapT = THREE.RepeatWrapping;
            plane.material.map.repeat.set(30, 30);
            plane.material.map.anisotropy = 16;
            
            plane.material.map.minFilter = THREE.LinearFilter;
            plane.material.map.magFilter = THREE.LinearFilter;
            plane.receiveShadow = true;
			
    
    
            objects.push(plane);
            scene.add(plane);
             // Define the URLs for the skybox images
            var urls = [
                'imgs/xpos.png',  // Right side
                'imgs/xneg.png',  // Left side
                'imgs/ypos.png',  // Top side
                'imgs/yneg.png',  // Bottom side
                'imgs/zpos.png',  // Front side
                'imgs/zneg.png',  // Back side
            ];

            createSkybox(urls);
    
            // Adding panels around the floor to create invisible walls
            // Define panel geometry and material
            var panelGeometry = new THREE.PlaneGeometry(5000, 5000);
            var panelMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load('yes.jpg'),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.material.side = THREE.DoubleSide; // Make the material double-sided
    
            // Positioning and adding four walls
            // Front panel
            var frontPanel = panel.clone();
            frontPanel.rotation.x = -Math.PI / 2;
            
            frontPanel.position.set(0, 1000, 2490);
    
            // Right panel
            var rightPanel = frontPanel.clone();
            rightPanel.rotation.y = Math.PI / 2;
            rightPanel.position.set(2490, 1000, 0);
            
            objects.push(rightPanel);
    
            // Back panel new panel
            var backPanelGeometry = new THREE.PlaneGeometry(5000, 5000);
            var backPanelMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load('yes.jpg'),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            var backPanel = new THREE.Mesh(backPanelGeometry, backPanelMaterial);
            //double sided
            backPanel.material.side = THREE.DoubleSide;
            objects.push(backPanel);
            backPanel.position.set(0, 1000, -2490);
    
            //Front panel
            var frontPanel2 = backPanel.clone();
            frontPanel2.position.set(0, 1000, 2490);
            objects.push(frontPanel2);
            // Add the panels to the scene
            scene.add(frontPanel2);
            scene.add(backPanel);
    
            // Left panel
            var leftPanel = rightPanel.clone();
            leftPanel.rotation.z = -Math.PI / 2;
            leftPanel.position.set(-2490, 1000, 0);
            
            objects.push(leftPanel);
    
            // Add the panels to the scene
            scene.add(leftPanel);
            scene.add(rightPanel);
            scene.add(backPanel);
                        
            // Trees
            
    
            for (var i = 0; i < 60; i++) {
                var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
                var trunkTexture = new THREE.TextureLoader().load("imgs/trunk.jpg");
                //standard material
                var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
                var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
                treeTrunk.castShadow = true; //default is false
                treeTrunk.receiveShadow = false; //default
                // Randomize foliage size
                var foliageHeight = Math.random() * 100 + 100; // Random height for the foliage
                var foliageRadius = Math.random() * 40 + 20; // Random radius for the foliage
    
                var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
                var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");
                //standard material
                var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
                var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
                treeFoliage.position.y = 50 + foliageHeight / 2;
                treeFoliage.castShadow = true;
                treeFoliage.receiveShadow = false;
    
                treeTrunk.add(treeFoliage);
    
                // Randomize tree position
                treeTrunk.position.x = Math.random() * (2600) - 1300;
                treeTrunk.position.y = 0; // Adjust the y position according to your scene
                treeTrunk.position.z = Math.random() * (4000) - 2000;
    
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
    
            //spawn trees on a different range
    
            for (var i = 0; i < 0; i++) {
                var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
                var trunkTexture = new THREE.TextureLoader().load("imgs/trunk.jpg");
                //standard material
                var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
                var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
                treeTrunk.castShadow = true; //default is false
                treeTrunk.receiveShadow = false; //default
                // Randomize foliage size
                var foliageHeight = Math.random() * 100 + 100; // Random height for the foliage
                var foliageRadius = Math.random() * 40 + 20; // Random radius for the foliage
    
                var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
                var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");
                //standard material
                var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
                var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
                treeFoliage.position.y = 50 + foliageHeight / 2;
                treeFoliage.castShadow = true;
                treeFoliage.receiveShadow = false;
    
                treeTrunk.add(treeFoliage);
    
                // Randomize tree position
                treeTrunk.position.x = Math.random() * (4000) - 2000;
                treeTrunk.position.y = 0; // Adjust the y position according to your scene
                treeTrunk.position.z = Math.random() * (2000) - 1000;
    
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
            var trunkTexture = new THREE.TextureLoader().load("imgs/trunk.jpg");
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
            var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");
            //standard material
            var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
            var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
            treeFoliage.position.y = 50 + foliageHeight / 2;
            treeFoliage.castShadow = true;
            
            objects.push(treeFoliage);
            treeTrunk.add(treeFoliage);
    
            treeTrunk.position.x = 0;
            treeTrunk.position.y = 0; // Adjust the y position according to your scene
            treeTrunk.position.z = -500;
    
            //add tree to scene
            scene.add(treeTrunk);
    
    
            //background color
            scene.background = new THREE.Color(0x000000);
    
            var moonTexture = new THREE.TextureLoader().load('imgs/moon.png'); // Carregar a textura da lua
            var moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture, side: THREE.FrontSide }); // Material usando a textura da lua
            var moonGeometry = new THREE.SphereGeometry(200, 64, 64); // Geometria esférica para a lua
            var moon = new THREE.Mesh(moonGeometry, moonMaterial); // Criar o objeto da lua
            moon.position.set(0, 3000, 4000); // Posicionar a lua no céu
            scene.add(moon); // Adicionar a lua à cena
    
            //video on panel
            var video = document.createElement('video');
            video.src = 'videos/running.mp4';
            video.load();
            
            video.loop = false;
            video.muted = true;
            video.autoplay = true;
            video.controls = false;
            video.width = 640;
            video.height = 360;
            video.style.display = 'hidden';
            
    
            //add a panel with the video
            var videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBFormat;
            var videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
            var videoGeometry = new THREE.PlaneGeometry(80, 80);
            
            var videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);
            videoScreen.rotation.y = Math.PI / 2;
            videoScreen.position.set(2000, 30, 2450);
            scene.add(videoScreen);
    
    
// Load textures
const textureLoader = new THREE.TextureLoader();
const headTexture = textureLoader.load('imgs/head.png');
const bodyTexture = textureLoader.load('imgs/black.png'); // Assuming you have a body texture

// Set the texture wrapping to clamp
bodyTexture.wrapS = THREE.ClampToEdgeWrapping;
bodyTexture.wrapT = THREE.ClampToEdgeWrapping;

// Create head geometry and material
const headGeometry = new THREE.SphereGeometry(2, 100, 100);
headGeometry.scale(0.8, 1.0, 0.7); // Adjust head shape

const headMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: headTexture,
    bumpMap: headTexture,
    bumpScale: 0.01, // Adjusted bump scale for better visibility
    reflectivity: 0.1,
    shininess: 0
});

const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0, 20, 0); // Adjust position to connect with body
head.scale.set(1.5, 1.5, 1.5);
head.rotation.y = Math.PI / 2; // Rotate head to face the correct direction

// Create body geometry and material
const bodyGeometry = new THREE.BoxGeometry(4, 15, 3);

const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: bodyTexture,
    bumpMap: bodyTexture,
    bumpScale: 0.01,
    reflectivity: 0.1,
    shininess: 0
});

const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.set(0, 10, 0); // Center the body
body.scale.set(1, 1.1, 1); // Scale the body in y-axis by 1.5

// Create arms and legs geometries and materials
const armLegMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    map: bodyTexture, // Use body texture for arms and legs
    bumpMap: bodyTexture,
    bumpScale: 0.01,
    reflectivity: 0.1,
    shininess: 0
});

const armGeometry = new THREE.BoxGeometry(1, 15, 0.75);
const legGeometry = new THREE.BoxGeometry(1, 20, 1.5);

const leftArm = new THREE.Mesh(armGeometry, armLegMaterial);
const rightArm = new THREE.Mesh(armGeometry, armLegMaterial);
const leftLeg = new THREE.Mesh(legGeometry, armLegMaterial);
const rightLeg = new THREE.Mesh(legGeometry, armLegMaterial);

leftArm.position.set(-3, 7, 0); // Position relative to body center and adjusted for connection
rightArm.position.set(3, 7, 0);
leftLeg.position.set(-1.25, -2.5, 0); // Position relative to body center and adjusted for connection
rightLeg.position.set(1.25, -2.5, 0);

// Scale arms and legs in y-axis by 1.5
leftArm.scale.set(1, 1.5, 1);
rightArm.scale.set(1, 1.5, 1);
leftLeg.scale.set(1, 1.5, 1);
rightLeg.scale.set(1, 1.5, 1);


// Group all parts together
const slenderMan = new THREE.Group();
slenderMan.add(head);
slenderMan.add(body);
slenderMan.add(leftArm);
slenderMan.add(rightArm);
slenderMan.add(leftLeg);
slenderMan.add(rightLeg);

slenderMan.scale.set(1.5,1.5,1.5);

// Adjust the overall position for the entire model
 // Position the entire group in the scene




// Add the group to the scene




            //weak ambient light
            var ambientLight = new THREE.AmbientLight(0xB0B0B0, 0.5);
            scene.add(ambientLight);
    
            var page = addPageToScene(2040,10, 2455, "imgs/page1.webp");
            page.rotation.y = Math.PI/2;
            page.scale.set(0.5, 0.5, 0.5);
            var page2 = addPageToScene(-1895, 10, -2079, "imgs/page2.webp");
            var page3 = addPageToScene(-2070, 420, -2105, "imgs/page3.jpeg");
            var page4 = addPageToScene(0, 10, -490,"imgs/page4.jpg");
            var page5 = addPageToScene(1500, 10, -1498,"imgs/page5.webp");
            var page6 = addPageToScene(-1784, 10, 2039,"imgs/page6.jpg");
            page6.rotation.y = -Math.PI/2;
            //invert the page on y
            
            var page7 = addPageToScene(-1634, 10, 1432,"imgs/page7.png");
            //meter laugh sound
            page7.rotation.y = -Math.PI/2;
            var page8 = addPageToScene(-1495, 10, 1740,"imgs/page8.webp");
            page8.rotation.y = -Math.PI/2;

        
            
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
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        
                        removerPaginaDoMapa(page);
                        //wait 1 sec
                        setTimeout(checkPageCounter, 1000);
                        video.play();
                        scream.play();
                        slenderMan.position.set(2400, 0, 2457);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page2) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        removerPaginaDoMapa(page2);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page3) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        slenderMan.position.set(-2070, 420, -1915);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        removerPaginaDoMapa(page3);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page4) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        slenderMan.rotation.y = Math.PI;
                        slenderMan.position.set(-5, 0, -320);
                        
                        scene.add(slenderMan);
                        slenderMan.rotation.y = -Math.PI;
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        removerPaginaDoMapa(page4);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page5) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        removerPaginaDoMapa(page5);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page6) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        slenderMan.position.set(-1760, 0, -1930);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        removerPaginaDoMapa(page6);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page7) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        slenderMan.position.set(-2070, 420, -1915);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
                        removerPaginaDoMapa(page7);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page8) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        slenderMan.position.set(-2070, 420, -1915);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 5000);
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
            elementoContagem.innerHTML = "Pages found: 0"
            document.body.appendChild(elementoContagem);
            
    
            var ambientLight = new THREE.AmbientLight(0x404040, 0.08);
            scene.add(ambientLight);
    
            
    
            
    
            //cenário 1
    
            function createBarn() {
                var barn = new THREE.Group();
            
                // Paredes exteriores
                var barnWidth = 1000;
                var barnHeight = 100;
                var barnDepth = 1000;
            
                var wallTexture = new THREE.TextureLoader().load('imgs/wall_texture.jpg');
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
                var roofGeometry = new THREE.BoxGeometry(barnWidth, barnDepth,20);
                var roofMaterial = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('imgs/wall_texture.jpg') });
                var roof = new THREE.Mesh(roofGeometry, roofMaterial);
                roof.rotation.x = Math.PI / 2;
                roof.position.y = barnHeight - 25;
                objects.push(roof);
                barn.add(roof);
            
                // Corredor
                var corridorWidth = 500;
                var corridorHeight = 130;
                var corridorDepth = 500;
            
                var corridorGeometry = new THREE.BoxGeometry(corridorWidth, corridorHeight, barnDepth - 300);
                var corridor = new THREE.Mesh(corridorGeometry, wallMaterial);
                corridor.position.set(0, corridorHeight / 3, 70);
                objects.push(corridor);
                barn.add(corridor);
    
                //wall that splits the barn
                var wall6Geometry = new THREE.BoxGeometry(5, barnHeight, barnDepth-100);
                var wall6 = new THREE.Mesh(wall6Geometry, wallMaterial);
                wall6.position.set(0, barnHeight / 3, 175);
                objects.push(wall6);
                barn.add(wall6);	
                return {
                    barn: barn
                };
            }
    
            
            var barnData = createBarn();
            var barn = barnData.barn;
            barn.position.set(1994, 0, 1994);
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
                const stepTexture = new THREE.TextureLoader().load('imgs/wood2.jpg');
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
            const legtexture = new THREE.TextureLoader().load('imgs/wood.jpg');
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
            stairs.position.set(-totalStepsPerSide * stepWidth / 2-1720, 0, -totalStepsPerSide * stepDepth / 2-1760);
    
            // Adicionar a torre de vigia à lista de objetos para interações futuras
            objects.push(stairs);
    
    
    
            var house = new THREE.Group();
    
            // Parâmetros da casa
            var houseWidth = 230;
            var houseHeight = 150;
            var houseDepth = 230;
    
            // Texturas e materiais
            var wallTexture = new THREE.TextureLoader().load('imgs/watchtower.png');
            var wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });
            var floorTexture = new THREE.TextureLoader().load('imgs/floor.jpg');
            var floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
    
            // Paredes
            var wall1Geometry = new THREE.BoxGeometry(houseWidth, houseHeight, 10);
            var wall1 = new THREE.Mesh(wall1Geometry, wallMaterial);
            wall1.position.set(0, houseHeight / 2, houseDepth / 2-5);
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
            var wall4Geometry = new THREE.BoxGeometry(9, houseHeight/3, 60);
            var wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
            wall4.position.set(-houseWidth / 2, houseHeight-24, -52);
            objects.push(wall4);
            house.add(wall4);
    
            //clone wall 1
            var wall5 = wall1.clone();
            wall5.position.set(0, houseHeight / 2, -houseDepth / 2+4);
            objects.push(wall5);
            house.add(wall5);
    
            var wall6Geoçmetry = new THREE.BoxGeometry(10, houseHeight, houseDepth);
            var wall6 = new THREE.Mesh(wall6Geoçmetry, wallMaterial);
            wall6.position.set(houseWidth / 2-4, houseHeight / 2, 0);
            objects.push(wall6);
            house.add(wall6);
    
            // Chão
            var floorGeometry = new THREE.BoxGeometry(houseWidth, 10, houseDepth);
            var floorTexture = new THREE.TextureLoader().load('imgs/watchtower.png');
            var floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
            var floor = new THREE.Mesh(floorGeometry, floorMaterial);
            floor.position.set(0, 4, 0); // Eleva levemente o chão para evitar z-fighting
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
            var wallInteriorGeometry = new THREE.BoxGeometry(10, houseHeight, (houseDepth - doorWidth) / 2 );
            var wallInterior1 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
            wallInterior1.position.set(0, houseHeight / 2, doorWidth);
            house.add(wallInterior1);
    
            var wallInterior2 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
            wallInterior2.position.set(0, houseHeight / 2, -(doorWidth));
            house.add(wallInterior2);
            
            
            // Posicionar a casafrente tras e lado
            house.position.set(-2000, 390, -2000);
            house.rotation.y = Math.PI;
    
            // Adicionar a casa à cena
            scene.add(house);
            scene.add(stairs);
    
            // Cenario 3
            const boxSize = 75;
            const maze = [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
                [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
                [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                
            ];
            
            
            
            // Create a single geometry for all blocks
            const boxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
            const material = new THREE.MeshLambertMaterial({map: new THREE.TextureLoader().load('imgs/maze.png')});
            
            const mazeObject = new THREE.Object3D();
    
            // Generate maze
            maze.forEach((row, i) => {
                row.forEach((cell, j) => {
                    if (cell === 1) {
                        const mesh = new THREE.Mesh(boxGeometry, material);
                        mesh.position.set(j * boxSize - ((maze[0].length * boxSize) / 2), boxSize / 2, i * boxSize - ((maze.length * boxSize) / 2));
                        if ((i === 0 && j === 5) || (i === 10 && j === 7) || (i === 10 && j === 9) || (i === 5 && j === 2)) {
                            // Define panel geometry and material
                            var panelGeometry = new THREE.PlaneGeometry(boxSize, boxSize );
                            
            
                            // Set position for the panel
                            let panelPositionZ = (i * boxSize - ((maze.length * boxSize) / 2)) + boxSize / 2 + boxSize / 100; // Default offset for panels in z
                            if (i === 10 && j === 9) {
                                // Special case for panel at 10,9 to adjust differently
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy1.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            //double sided
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                
                                panel.rotation.y = -Math.PI / 2;
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2))+boxSize/2-boxSize/100, boxSize / 2, (i * boxSize - ((maze.length * boxSize) / 2))-boxSize);
                            }
                            else if (i === 5 && j === 2) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy2.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            //double sided
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                // Special case for panel at 5,2 to adjust differently
                                panelPositionZ += (boxSize + boxSize / 100);
                                panel.rotation.y = Math.PI / 2;
                                panel.position.set(((j * boxSize - (((maze[0].length * boxSize) / 2)))+boxSize/2)+boxSize/100, boxSize / 2, (i * boxSize - ((maze.length * boxSize) / 2)));
                            }
                            else if (i === 0 && j === 5) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy3.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            //double sided
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                // Special case for panel at 0,5 to adjust differently
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2)), boxSize / 2, ((i * boxSize - ((maze.length * boxSize) / 2)))+ boxSize/2 + boxSize/100);
                            }
                            else if (i === 10 && j === 7) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy4.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            //double sided
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                panel.rotation.y = Math.PI;
                                // Special case for panel at 10,7 to adjust differently
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2))+2*boxSize, boxSize / 2, ((i * boxSize - ((maze.length * boxSize) / 2)))- 5*boxSize/2 - boxSize/100);
                            }
                            
                            
                            // Add panel to the object group
                            mazeObject.add(panel);
                            // Add panel to the objects array
                            objects.push(panel);
                        }
                        
                        
                        mazeObject.add(mesh); // Add mesh to the group
                        objects.push(mesh); // Add mesh to the objects array
                    }
                });
            });
            
            // Optionally, set the position of the maze group (if you want to move it to a specific location in the scene)
            mazeObject.rotation.y = Math.PI;
            mazeObject.position.set(-1700, -10, 1700);
            
            // Add the maze group to the scene
            scene.add(mazeObject);
    
            // Cenario 4
    
            // Materials
            const material1 = new THREE.MeshLambertMaterial({ color: 0x222222 });
            const lightMaterial = new THREE.MeshStandardMaterial({ emissive: 0xFFFFFF });
    
            // Base steps
            const base = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), material1);
            const step1 = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), material1);
            const step2 = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 6), material1);
    
            // Position steps
            step1.position.y = 2;
            step2.position.y = 4;
    
            // Main vertical pole
            const pole = new THREE.Mesh(new THREE.BoxGeometry(3, 100, 3), material1);
            pole.position.y = 54; // Height of the steps (2+2+2) + half the pole's height (50)
    
            // Horizontal pole
            const pole2 = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 3), material1);
            pole2.position.set(10, 100, 0); // Positioned at the top of the vertical pole
    
            // Light bulb
            const lightBulb = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 16), lightMaterial);
            lightBulb.position.set(20, 100, 0); // At the end of the horizontal pole
    
            // Point light
            const pointLight = new THREE.PointLight(0xFFFFFF, 1, 200);
    
    
            pointLight.position.copy(lightBulb.position); // Match the light bulb's position
    
    
            // Lamp group
            const lamp = new THREE.Group();
            lamp.add(base);
            lamp.add(step1);
            lamp.add(step2);
            lamp.add(pole);
            lamp.add(pole2);
            lamp.add(lightBulb);
            lamp.add(pointLight);
    
    
            // Add the lamp to the scene
    
            lamp.position.set(1500, -10, -1500);
            lamp.rotation.y = Math.PI;
            scene.add(lamp);
    
            camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 8000 );
            camera.position.y = 10;
            camera.position.z = 0;
            camera.rotation.y = Math.PI;
    
            //weak ambiente light
            var ambientLight = new THREE.AmbientLight(0x404040, 0.08);
            scene.add(ambientLight);
            
    
            spotLight = new THREE.SpotLight(0xffffff, 1, 0, 0.7 );
            camera.add(spotLight);
            camera.add(spotLight.target);
    
            
            spotLight.intensity = 2;
            spotLight.target.position.z = -1;
            spotLight.target.position.y = 1;
            spotLight.target.position.x = 0;
            spotLight.distance = 2000;
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
    
    //stairs 
    function createStairs() {
        var stairs = new THREE.Group();
        var stairWidth = 100;
        var stairHeight = 10;
        var stairDepth = 50;
        var stairTexture = new THREE.TextureLoader().load('imgs/wall_texture.jpg');
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
    
    
    
    function addPageToScene(x,y, z, texture) {
    
            // white page texture
            var pageTexture = new THREE.TextureLoader().load(texture);
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
            if (playerPosition.x < 2000 && playerPosition.x > 1965 && playerPosition.z < 1500 && playerPosition.z > 1460 && warningSound.played === false) {
                warningSound.play();
                warningSound.played = true; // Ensure sound is not played repeatedly
            }
        }
    
        ambientSound.play();
        
    }
    
    function checkPageCounter(counterPage) {
        if (counterPage === 8) {
            WON = true;

            clearInterval(timer);
            document.getElementById("game-won").style.display = "block";

            document.getElementById("game-won").innerHTML = "<p style='font-size: 40px; position: absolute; bottom: 0; width: 100%; text-align: center; margin-bottom: 10%; left:-2%; '>Congrats! You colected all the pages! <br> Time: " + document.getElementById("minutes").innerHTML + "m " + document.getElementById("seconds").innerHTML + "s <br> Returning to main menu in 10 seconds...</p>";
            var countDown = 10;
            var countDownTimer = setInterval(function() {
                countDown--;
                document.getElementById("game-won").innerHTML = "<p style='font-size: 40px; position: absolute; bottom: 0; width: 100%; text-align: center; margin-bottom: 10%; left:-2%; '>Congrats! You colected all the pages! <br> Time: " + document.getElementById("minutes").innerHTML + "m " + document.getElementById("seconds").innerHTML + "s <br> Returning to main menu in " + countDown + " seconds...</p>";
                if (countDown <= 0) {
                    clearInterval(countDownTimer);
                    window.location.href = "index.html";
                }
            }, 1000);
			
            setTimeout(reloadPage, 10000);
        }
        
    }
    
	function initialiseTimer() {
		var sec = 0;  // Segundos inicializados
		function pad(val) { return val > 9 ? val : "0" + val; }  // Função para formatar os números
	
		timer = setInterval(function() {
			if (isGameActive) {  // Checa se o jogo está ativo
				sec++;  // Incrementa os segundos apenas se o jogo estiver ativo
				document.getElementById("seconds").innerHTML = pad(sec % 60);
				document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
			}
		}, 1000);
        //add event listener to the window to check if timer is at 6 seconds
        
	}
    function endGame() {
        clearInterval(timer);
        var gameOverScreen = document.getElementById("game-over");
        gameOverScreen.style.display = "block";
        gameOverScreen.style.backgroundImage = "url('imgs/image.png')"; // Add your image path here
        gameOverScreen.style.backgroundSize = "cover"; // Ensure the image covers the entire element
        gameOverScreen.innerHTML = "<p style='font-size: 40px; position: absolute; bottom: 0; width: 100%; text-align: center; margin-bottom: 10%; left:-2%; '>Better luck next time! <br> Returning to main menu in " + countDown + " seconds...</p>";
        var countDown = 10;
        var countDownTimer = setInterval(function() {
            countDown--;
            gameOverScreen.innerHTML = "<p style='font-size: 40px;position: absolute; bottom: 0; width: 100%; text-align: center; margin-bottom: 10%; left:-2%;'>Better luck next time! <br> Returning to main menu in " + countDown + " seconds...</p>";		if (countDown <= 0) {
                clearInterval(countDownTimer);
                window.location.href = "index.html";
            }
        }, 1000);
        ambientSound.pause();
        final.play();
        setTimeout(reloadPage, 10000);
    }

    function createSkybox(urls) {
       
        
    
        // Load the cube texture
        var loader = new THREE.CubeTextureLoader();
        var textureCube = loader.load(urls);
    
        // Create shader for the skybox
        var shader = THREE.ShaderLib['cube'];
        shader.uniforms['tCube'].value = textureCube;
    
        // Create the skybox material
        var material = new THREE.ShaderMaterial({
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            side: THREE.BackSide  // Render faces from inside of the cube
        });
    
        // Create skybox geometry
        var geometry = new THREE.BoxGeometry(10000, 10000, 10000);
    
        // Create skybox mesh
        var skybox = new THREE.Mesh(geometry, material);
    
        // Add the skybox to the scene
        scene.add(skybox);
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
    
    
    
    
    startGame();
    
    