
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
            
            screamSound.volume = 1.0;
            setInterval(function() {
                screamSound.play();
            }, 90000);
    
            ambientSound.volume = 0.1;
            final.volume = 0.8;

			document.addEventListener('click', function activateGame() {
				if (!isGameActive) {  
					isGameActive = true;
					console.log("Jogo ativado.");

					document.removeEventListener('click', activateGame);

					initialiseTimer();
                    setTimeout(endGame, 300000);

				}
			});

            // Floor
            const geometry = new THREE.PlaneGeometry(5000, 5000, 32);
            const groundMaterial = new THREE.MeshPhysicalMaterial();
            const plane = new THREE.Mesh(geometry, groundMaterial);
    
            plane.rotation.x = -Math.PI / 2; 
            plane.position.y = -10; 
                   
            plane.material.map = new THREE.TextureLoader().load('imgs/ground.jpg');
            plane.material.map.wrapS = THREE.RepeatWrapping;
            plane.material.map.wrapT = THREE.RepeatWrapping;
            plane.material.map.repeat.set(15, 15);
            plane.material.map.anisotropy = 16;
            
            plane.material.map.minFilter = THREE.LinearFilter;
            plane.material.map.magFilter = THREE.LinearFilter;
            plane.receiveShadow = true;

            objects.push(plane);
            scene.add(plane);

            var panelGeometry = new THREE.PlaneGeometry(5000, 5000);
            var panelMaterial = new THREE.MeshStandardMaterial({
                map: new THREE.TextureLoader().load(''),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.material.side = THREE.DoubleSide; 

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
                treeTrunk.castShadow = true;
                treeTrunk.receiveShadow = false; 
               
                var foliageHeight = Math.random() * 100 + 100;
                var foliageRadius = Math.random() * 40 + 20;
    
                var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
                var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");

                var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
                var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
                treeFoliage.position.y = 50 + foliageHeight / 2;
                treeFoliage.castShadow = true;
                treeFoliage.receiveShadow = false;
    
                treeTrunk.add(treeFoliage);

                treeTrunk.position.x = Math.random() * (2600) - 1300;
                treeTrunk.position.y = 0; 
                treeTrunk.position.z = Math.random() * (4000) - 2000;
    
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

                var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
                var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
                treeTrunk.castShadow = true; 
                treeTrunk.receiveShadow = false; 
                
                var foliageHeight = Math.random() * 100 + 100; 
                var foliageRadius = Math.random() * 40 + 20; 
    
                var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
                var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");
                
                var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
                var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
                treeFoliage.position.y = 50 + foliageHeight / 2;
                treeFoliage.castShadow = true;
                treeFoliage.receiveShadow = false;
    
                treeTrunk.add(treeFoliage);

                treeTrunk.position.x = Math.random() * (4000) - 2000;
                treeTrunk.position.y = 0; 
                treeTrunk.position.z = Math.random() * (2000) - 1000;
    
                scene.add(treeTrunk);
                objects.push(treeTrunk);
                objects.push(treeFoliage);
            }
            window.addEventListener('load', function() {
                document.getElementById('loading-screen').style.display = 'none';
            });
    
            
            var treeTrunkGeometry = new THREE.CylinderGeometry(10, 10, 100, 32);
            var trunkTexture = new THREE.TextureLoader().load("imgs/trunk.jpg");
            
            var trunkMaterial = new THREE.MeshStandardMaterial({ map: trunkTexture });
            var treeTrunk = new THREE.Mesh(treeTrunkGeometry, trunkMaterial);
            treeTrunk.castShadow = true; 
            treeTrunk.receiveShadow = false; 
            objects.push(treeTrunk);
            
            var foliageHeight = 200; 
            var foliageRadius = 50; 
    
            var treeFoliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 32);
            var foliageTexture = new THREE.TextureLoader().load("imgs/leaves.jpg");
            
            var foliageMaterial = new THREE.MeshStandardMaterial({ map: foliageTexture });
    
            var treeFoliage = new THREE.Mesh(treeFoliageGeometry, foliageMaterial);
            treeFoliage.position.y = 50 + foliageHeight / 2;
            treeFoliage.castShadow = true;
            
            objects.push(treeFoliage);
            treeTrunk.add(treeFoliage);
    
            treeTrunk.position.x = 0;
            treeTrunk.position.y = 0; 
            treeTrunk.position.z = -500;

            scene.add(treeTrunk);

            scene.background = new THREE.Color(0x000000);
    
            var moonTexture = new THREE.TextureLoader().load('imgs/moon.png'); 
            var moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture, side: THREE.FrontSide }); 
            var moonGeometry = new THREE.SphereGeometry(200, 64, 64); 
            var moon = new THREE.Mesh(moonGeometry, moonMaterial); 
            moon.position.set(0, 2000, 400); 
            scene.add(moon); 
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
            const bodyTexture = textureLoader.load('imgs/black.png'); 
            
            bodyTexture.wrapS = THREE.ClampToEdgeWrapping;
            bodyTexture.wrapT = THREE.ClampToEdgeWrapping;
            
            const headGeometry = new THREE.SphereGeometry(2, 100, 100);
            headGeometry.scale(0.8, 1.0, 0.7);

            const headMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: headTexture,
                bumpMap: headTexture,
                bumpScale: 0.01, 
                reflectivity: 0.1,
                shininess: 0
            });

            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.set(0, 20, 0); 
            head.scale.set(1.5, 1.5, 1.5);
            head.rotation.y = Math.PI / 2 + Math.PI/10; 

            const bodyGeometry = new THREE.BoxGeometry(4, 13, 3);

            const bodyMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                map: bodyTexture,
                bumpMap: bodyTexture,
                bumpScale: 0.01,
                reflectivity: 0.1,
                shininess: 0
            });

            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.position.set(0, 11, 0); // Center the body
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

            leftArm.position.set(-2.7, 6.5, 0); 
            rightArm.position.set(2.7, 6.5, 0);
            leftLeg.position.set(-1.25, -2.5, 0); 
            rightLeg.position.set(1.25, -2.5, 0);

            leftArm.scale.set(1, 1.5, 1);
            rightArm.scale.set(1, 1.5, 1);
            leftLeg.scale.set(1, 1.5, 1);
            rightLeg.scale.set(1, 1.5, 1);

            const slenderMan = new THREE.Group();
            slenderMan.add(head);
            slenderMan.add(body);
            slenderMan.add(leftArm);
            slenderMan.add(rightArm);
            slenderMan.add(leftLeg);
            slenderMan.add(rightLeg);

            slenderMan.scale.set(1.5,1.5,1.5);

            var ambientLight = new THREE.AmbientLight(0xB0B0B0, 0.2);
            scene.add(ambientLight);
    
            var page = addPageToScene(2045,28, 2450, "imgs/page1.webp");
            page.rotation.y = Math.PI/2;
            page.scale.set(0.5, 0.5, 0.5);
            var page2 = addPageToScene(-1895, 15, -2079, "imgs/page2.webp");
            var page3 = addPageToScene(-2070, 430, -2103, "imgs/page3.jpeg");
            var page4 = addPageToScene(0, 15, -490,"imgs/page4.jpg");
            var page5 = addPageToScene(1500, 15, -1498,"imgs/page5.webp");
            var page6 = addPageToScene(-1784, 15, 2039,"imgs/page6.jpg");
            page6.rotation.y = -Math.PI/2;

            var page7 = addPageToScene(-1634, 15, 1432,"imgs/page7.png");
            page7.rotation.y = -Math.PI/2;
            var page8 = addPageToScene(-1495, 15, 1740,"imgs/page8.webp");
            page8.rotation.y = -Math.PI/2;

            ambientSound.loop = true;

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
                        setTimeout(checkPageCounter, 1000);
                        video.play();
                        scream.play();
                        slenderMan.position.set(2400, 0, 2457);
                        slenderMan.rotation.y = Math.PI/2;
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 10000);
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
                        slenderMan.position.set(-2050, 420, -1915);
                        
                        scene.add(slenderMan);
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 10000);
                        removerPaginaDoMapa(page3);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page4) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        
                        slenderMan.position.set(-5, 0, -320);
                        
                        scene.add(slenderMan);
                        
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 10000);
                        removerPaginaDoMapa(page4);
                        checkPageCounter(counterPage);
                    }
                    if (intersects[0].object === page5) {
                        counterPage++;
                        elementoContagem.innerHTML = "Pages found: "+counterPage;
                        pageSound.play();
                        
                        setTimeout(function() {
                            scene.remove(slenderMan);
                        }, 10000);
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
                        }, 10000);
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
            const stepWidth = 60; 
            const stepHeight = 10;
            var stepDepth = 50; 
            let currentHeight = 0;
            const totalStepsPerSide = 5; 
            const totalSides = 8;

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
                case 0:
                    xPosition = i * stepWidth;
                    zPosition = 0;
                    break;
                case 1:
                    xPosition = totalStepsPerSide * stepWidth;
                    zPosition = i * stepDepth;
                    break;
                case 2: 
                    xPosition = totalStepsPerSide * stepWidth - i * stepWidth;
                    zPosition = totalStepsPerSide * stepDepth;
                    break;
                case 3: 
                    xPosition = 0;
                    zPosition = totalStepsPerSide * stepDepth - i * stepDepth;
                    break;
                case 4:
                    xPosition = i * stepWidth;
                    zPosition = 0;
                    break;
                case 5:
                    xPosition = totalStepsPerSide * stepWidth;
                    zPosition = i * stepDepth;
                    break;
                case 6: 	
                    xPosition = totalStepsPerSide * stepWidth - i * stepWidth;
                    zPosition = totalStepsPerSide * stepDepth;
                    break;
                case 7:
                    xPosition = 0;
                    zPosition = totalStepsPerSide * stepDepth - i * stepDepth;
                    break;
                }
            
                step.position.set(xPosition, currentHeight, zPosition);
                stairs.add(step);
                currentHeight += stepHeight; 
            }
            }

            stairs.position.set(0, 0, 0);

            //pernas da torre
            const legOffset = -25; 
            const legHeight = 400; 
            const legWidth = 10; 
            const legDepth = 10; 
    
            // Criar as pernas
            for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);
            const legtexture = new THREE.TextureLoader().load('imgs/wood.jpg');
            const legMaterial = new THREE.MeshLambertMaterial({ map: legtexture});
            const leg = new THREE.Mesh(legGeometry, legMaterial);
    
            let xPosition = (i % 2) * ((totalStepsPerSide - 1) * stepWidth + legOffset) - legOffset; // X
            let zPosition = Math.floor(i / 2) * ((totalStepsPerSide - 1) * stepDepth + legOffset) - legOffset; // Z
    
            leg.position.set(xPosition, legHeight / 2, zPosition);
            stairs.add(leg); 
            }

            stairs.rotation.y = Math.PI;
            stairs.position.set(-totalStepsPerSide * stepWidth / 2-1720, -5, -totalStepsPerSide * stepDepth / 2-1760);
    
            objects.push(stairs);
    
            var house = new THREE.Group();
    
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
            var doorWidth = 80; 
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
    
            var wall4Geometry = new THREE.BoxGeometry(9, houseHeight/3, 60);
            var wall4 = new THREE.Mesh(wall4Geometry, wallMaterial);
            wall4.position.set(-houseWidth / 2, houseHeight-24, -52);
            objects.push(wall4);
            house.add(wall4);
    
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
            floor.position.set(0, 4, 0); 
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
    
            // Paredes internas e porta
            var wallInteriorGeometry = new THREE.BoxGeometry(10, houseHeight, (houseDepth - doorWidth) / 2 );
            var wallInterior1 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
            wallInterior1.position.set(0, houseHeight / 2, doorWidth);
            house.add(wallInterior1);
    
            var wallInterior2 = new THREE.Mesh(wallInteriorGeometry, wallMaterial);
            wallInterior2.position.set(0, houseHeight / 2, -(doorWidth));
            house.add(wallInterior2);

            house.position.set(-2000, 390, -2000);
            house.rotation.y = Math.PI;
    
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
                            var panelGeometry = new THREE.PlaneGeometry(boxSize, boxSize );
                            
                            let panelPositionZ = (i * boxSize - ((maze.length * boxSize) / 2)) + boxSize / 2 + boxSize / 100; // Default offset for panels in z
                            if (i === 10 && j === 9) {
                                // Special case for panel at 10,9 to adjust differently
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy1.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                
                                panel.rotation.y = -Math.PI / 2;
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2))+boxSize/2-boxSize/100, boxSize / 2, (i * boxSize - ((maze.length * boxSize) / 2))-boxSize);
                            }
                            else if (i === 5 && j === 2) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy2.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                           
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                
                                panelPositionZ += (boxSize + boxSize / 100);
                                panel.rotation.y = Math.PI / 2;
                                panel.position.set(((j * boxSize - (((maze[0].length * boxSize) / 2)))+boxSize/2)+boxSize/100, boxSize / 2, (i * boxSize - ((maze.length * boxSize) / 2)));
                            }
                            else if (i === 0 && j === 5) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy3.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2)), boxSize / 2, ((i * boxSize - ((maze.length * boxSize) / 2)))+ boxSize/2 + boxSize/100);
                            }
                            else if (i === 10 && j === 7) {
                                var panelTexture = new THREE.TextureLoader().load('imgs/creepy4.jpg');
                            var panelMaterial = new THREE.MeshStandardMaterial({ map: panelTexture });
                            
                            var panel = new THREE.Mesh(panelGeometry, panelMaterial);
                                panel.rotation.y = Math.PI;
                                panel.position.set((j * boxSize - ((maze[0].length * boxSize) / 2))+2*boxSize, boxSize / 2, ((i * boxSize - ((maze.length * boxSize) / 2)))- 5*boxSize/2 - boxSize/100);
                            }

                            mazeObject.add(panel);
                            objects.push(panel);
                        }
                        
                        mazeObject.add(mesh); 
                        objects.push(mesh); 
                    }
                });
            });
 
            mazeObject.rotation.y = Math.PI;
            mazeObject.position.set(-1700, -10, 1700);

            scene.add(mazeObject);
    
            // Cenario 4

            const material1 = new THREE.MeshLambertMaterial({ color: 0x222222 });
            const lightMaterial = new THREE.MeshStandardMaterial({ emissive: 0xFFFFFF });

            const base = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), material1);
            const step1 = new THREE.Mesh(new THREE.BoxGeometry(8, 2, 8), material1);
            const step2 = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 6), material1);

            step1.position.y = 2;
            step2.position.y = 4;

            const pole = new THREE.Mesh(new THREE.BoxGeometry(3, 100, 3), material1);
            pole.position.y = 54; 

            const pole2 = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 3), material1);
            pole2.position.set(10, 100, 0); 

            const lightBulb = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 16), lightMaterial);
            lightBulb.position.set(20, 100, 0); 

            const pointLight = new THREE.PointLight(0xFFFFFF, 1, 200);
    
            pointLight.position.copy(lightBulb.position); 
    
            const lamp = new THREE.Group();
            lamp.add(base);
            lamp.add(step1);
            lamp.add(step2);
            lamp.add(pole);
            lamp.add(pole2);
            lamp.add(lightBulb);
            lamp.add(pointLight);
    
            lamp.position.set(1500, -10, -1500);
            lamp.rotation.y = Math.PI;
            scene.add(lamp);
    
            camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 6000 );
            camera.position.y = 20;
            camera.position.z = 0;
            camera.rotation.y = Math.PI;

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
    
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setClearColor( 0xffffff );
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            ScreenOverlay(controls); 
            document.body.appendChild( renderer.domElement );
        
    }
     
    function removerPaginaDoMapa(pagina) {
        scene.remove(pagina);
        objects = objects.filter(function (obj) {
            return obj !== pagina;
        });
    }
    
    //escadas
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
    
            var pageTexture = new THREE.TextureLoader().load(texture);
            var pageMaterial = new THREE.MeshBasicMaterial({ map: pageTexture });

            pageMaterial.side = THREE.DoubleSide;

            var pageGeometry = new THREE.PlaneGeometry(20, 20);
            var page = new THREE.Mesh(pageGeometry, pageMaterial);

            page.position.set(x, y, z);

            scene.add(page);

            objects.push(page);

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
            var playerPosition = controls.getPlayer().position; 
            var coordsText = `Coordenadas: X=${playerPosition.x.toFixed(2)}, Y=${playerPosition.y.toFixed(2)}, Z=${playerPosition.z.toFixed(2)}`;
            document.getElementById('playerCoords').innerText = coordsText;
            if (playerPosition.x < 2000 && playerPosition.x > 1965 && playerPosition.z < 1500 && playerPosition.z > 1460 && warningSound.played === false) {
                warningSound.play();
                warningSound.played = true;
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
		var sec = 0;  
		function pad(val) { return val > 9 ? val : "0" + val; }  
	
		timer = setInterval(function() {
			if (isGameActive) {  
				sec++;  
				document.getElementById("seconds").innerHTML = pad(sec % 60);
				document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));
			}
		}, 1000);

	}

    function endGame() {
        clearInterval(timer);
        var gameOverScreen = document.getElementById("game-over");
        gameOverScreen.style.display = "block";
        gameOverScreen.style.backgroundImage = "url('imgs/image.png')"; 
        gameOverScreen.style.backgroundSize = "cover"; 
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
    
    function eventHandlers() {
    
        var onKeyDown = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, true); };
        var onKeyUp = function ( event ) { event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, false); };
        document.addEventListener( 'keydown', onKeyDown, false );
        document.addEventListener( 'keyup', onKeyUp, false );

        window.addEventListener( 'resize', onWindowResize, false );
    }

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

            setJumpFactor: function (setJumpFactor) {
                jumpFactor = setJumpFactor;
            }
    
        };
    
        };

    startGame();
    
    