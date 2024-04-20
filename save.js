addTrees(scene, 'trunk_texture.jpg', 'leaves_texture.jpg', 20);

function createTreeGroup(trunkTexture, leavesTexture, trunkHeight, leavesHeight) {
    // Cria o tronco da árvore
    var trunkGeometry = new THREE.CylinderGeometry(50, 50, trunkHeight, 32);
    var trunkMaterial = new THREE.MeshBasicMaterial({ map: trunkTexture });
    var trunkMesh = new THREE.Mesh(trunkGeometry, trunkMaterial);

    // Cria as folhas da árvore
    var leavesGeometry = new THREE.SphereGeometry(200, 32, 32);
    var leavesMaterial = new THREE.MeshBasicMaterial({ map: leavesTexture, side: THREE.DoubleSide });
    var leavesMesh = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leavesMesh.position.y = (trunkHeight / 2) + (leavesHeight / 2);

    // Agrupa o tronco e as folhas
    var treeGroup = new THREE.Group();
    treeGroup.add(trunkMesh);
    treeGroup.add(leavesMesh);
    leavesMesh.position.y -= trunkHeight / 2; // Ajusta a posição das folhas em relação ao tronco

    return treeGroup;
}


function addTrees(scene, trunkTexturePath, leavesTexturePath, numberOfTrees) {
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load(trunkTexturePath, function (trunkTexture) {
        textureLoader.load(leavesTexturePath, function (leavesTexture) {
            for (var i = 0; i < numberOfTrees; i++) {
                // Define alturas aleatórias para o tronco e as folhas
                var trunkHeight = Math.random() * (1000 - 500) + 500;
                var leavesHeight = Math.random() * (1000 - 500) + 500;

                // Cria uma árvore
                var tree = createTreeGroup(trunkTexture, leavesTexture, trunkHeight, leavesHeight);

                // Define posições aleatórias para a árvore
                var x = Math.random() * 10000 - 5000;
                var z = Math.random() * 10000 - 5000;
                tree.position.set(x, 0, z);

                // Adiciona a árvore à cena
                scene.add(tree);
            }
        });
    });
}