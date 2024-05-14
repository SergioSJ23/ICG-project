// Three.js script to load a 3D character model

let scene, camera, renderer, model, mixer;

function initModel() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, -3, 30);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb';
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg');
    texture.flipY = false; // Texture flipping
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        color: 0xffffff,
        skinning: true
    });

    const loader = new THREE.GLTFLoader();
    loader.load(MODEL_PATH, function (gltf) {
        model = gltf.scene;
        model.traverse(o => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
                o.material = material;
            }
        });
        model.scale.set(7, 7, 7);
        model.position.y = -11;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model); // Animation mixer for playing animations
        const idleAnim = THREE.AnimationClip.findByName(gltf.animations, 'idle');
        const idle = mixer.clipAction(idleAnim);
        idle.play();
    }, undefined, function (error) {
        console.error(error);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    renderer.render(scene, camera);
}

initModel();
